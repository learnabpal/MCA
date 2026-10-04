import re
from functools import lru_cache

import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer, pipeline
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer




MODEL_NAME = 'distilbert/distilbert-base-uncased-finetuned-sst-2-english'


# @lru_cache(maxsize = 1)
# def get_transformer() :
# 	return pipeline(
# 		'sentiment-analysis',
# 		model = MODEL_NAME,
# 		tokenizer = MODEL_NAME,
# 		device = -1,
# 	)
@lru_cache(maxsize = 1)
def get_transformer() :
	tokeniser = AutoTokenizer.from_pretrained(MODEL_NAME)
	model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)
	model.eval()
	return tokeniser, model


@lru_cache(maxsize = 1)
def get_vader() :
	return SentimentIntensityAnalyzer()


def word_count( t ) : return re.findall(r"\b[\w'-]+\b", t.lower())


def analyse_text( text ) :
	tokeniser, model = get_transformer()
	vader = get_vader()
	
	sentences = [
		sentence.strip()
		for sentence in re.split(r'(?<=[.!?])\s+', text.strip())
		if sentence.strip()
	]
	
	model_chunks = [ ]
	
	encoded = tokeniser(
		text,
		truncation = True,
		max_length = 512,
		stride = 32,
		return_overflowing_tokens = True,
		padding = True,
		return_tensors = 'pt'
	)
	
	with torch.no_grad() :
		logits = model(
			input_ids = encoded[ 'input_ids' ],
			attention_mask = encoded[ 'attention_mask' ]
		).logits
	
	probabilities = torch.softmax(logits, dim = -1)
	
	for probability in probabilities :
		positive_probability = float(probability[ model.config.label2id[ 'POSITIVE' ] ])
		negative_probability = float(probability[ model.config.label2id[ 'NEGATIVE' ] ])
		
		model_chunks.append(
			{
				'positive' : positive_probability,
				'negative' : negative_probability
			}
		)
	
	model_positive = sum(
		chunk[ 'positive' ]
		for chunk in model_chunks
	) / len(model_chunks) if model_chunks else 0.5
	
	model_negative = sum(
		chunk[ 'negative' ]
		for chunk in model_chunks
	) / len(model_chunks) if model_chunks else 0.5
	
	vader_result = vader.polarity_scores(text)
	vader_compound = float(vader_result[ 'compound' ])
	
	vader_positive_score = (vader_compound + 1) / 2
	vader_negative_score = 1 - vader_positive_score
	
	combined_positive = (
		model_positive * 0.6
		+ vader_positive_score * 0.4
	)
	
	combined_negative = (
		model_negative * 0.6
		+ vader_negative_score * 0.4
	)
	
	final_label = 'POSITIVE' if combined_positive >= combined_negative else 'NEGATIVE'
	final_score = max(combined_positive, combined_negative)
	
	model_raw_label = 'POSITIVE' if model_positive >= model_negative else 'NEGATIVE'
	model_raw_score = max(model_positive, model_negative)
	
	if vader_compound >= 0.05 :
		vader_raw_label = 'POSITIVE'
	elif vader_compound <= -0.05 :
		vader_raw_label = 'NEGATIVE'
	else :
		vader_raw_label = 'NEUTRAL'
	
	sentence_results = [ ]
	vader_sentence_labels = [ ]
	
	for sentence in sentences :
		sentence_encoded = tokeniser(
			sentence,
			truncation = True,
			max_length = 512,
			return_tensors = 'pt'
		)
		
		with torch.no_grad() :
			sentence_logits = model(**sentence_encoded).logits
		
		sentence_probabilities = torch.softmax(sentence_logits, dim = -1)[ 0 ]
		
		sentence_positive = float(
			sentence_probabilities[ model.config.label2id[ 'POSITIVE' ] ]
		)
		
		sentence_negative = float(
			sentence_probabilities[ model.config.label2id[ 'NEGATIVE' ] ]
		)
		
		sentence_vader = vader.polarity_scores(sentence)
		sentence_compound = float(sentence_vader[ 'compound' ])
		
		if sentence_compound >= 0.05 :
			sentence_vader_label = 'POSITIVE'
		elif sentence_compound <= -0.05 :
			sentence_vader_label = 'NEGATIVE'
		else :
			sentence_vader_label = 'NEUTRAL'
		
		vader_sentence_labels.append(sentence_vader_label)
		
		sentence_vader_positive = (sentence_compound + 1) / 2
		sentence_vader_negative = 1 - sentence_vader_positive
		
		sentence_combined_positive = (
			sentence_positive * 0.6
			+ sentence_vader_positive * 0.4
		)
		
		sentence_combined_negative = (
			sentence_negative * 0.6
			+ sentence_vader_negative * 0.4
		)
		
		sentence_final_label = (
			'POSITIVE'
			if sentence_combined_positive >= sentence_combined_negative
			else 'NEGATIVE'
		)
		
		sentence_final_score = max(
			sentence_combined_positive,
			sentence_combined_negative
		)
		
		sentence_results.append(
			{
				'text'            : sentence,
				'label'           : sentence_final_label,
				'score'           : round(sentence_final_score * 100, 1),
				'vader_label'     : sentence_final_label,
				'vader_compound'  : round(sentence_compound, 3),
				'model_raw_label' : (
					'POSITIVE'
					if sentence_positive >= sentence_negative
					else 'NEGATIVE'
				),
				'token_count'     : len(word_count(sentence)),
			}
		)
	
	sentence_count = len(sentences)
	
	vader_positive_sentences = vader_sentence_labels.count('POSITIVE')
	vader_negative_sentences = vader_sentence_labels.count('NEGATIVE')
	vader_neutral_sentences = vader_sentence_labels.count('NEUTRAL')
	
	vader_positive = (
		round(vader_positive_sentences / sentence_count * 100, 1)
		if sentence_count else 0
	)
	
	vader_negative = (
		round(vader_negative_sentences / sentence_count * 100, 1)
		if sentence_count else 0
	)
	
	vader_neutral = (
		round(vader_neutral_sentences / sentence_count * 100, 1)
		if sentence_count else 0
	)
	
	words = word_count(text)
	
	stop_words = {
		'the', 'and', 'that', 'this', 'with', 'from', 'have', 'has',
		'was', 'were', 'are', 'for', 'you', 'your', 'they', 'their',
		'but', 'not', 'too', 'very', 'its', 'our', 'out', 'about',
		'into', 'just', 'than', 'then', 'when', 'what', 'which',
		'would', 'could', 'should', 'there', 'here', 'been', 'being',
		'will', 'can', 'all', 'one', 'two', 'also', 'more', 'some',
	}
	
	frequency = { }
	
	for word in words :
		if len(word) >= 3 and word not in stop_words :
			frequency[ word ] = frequency.get(word, 0) + 1
	
	keywords = sorted(
		frequency.items(),
		key = lambda item : (-item[ 1 ], item[ 0 ])
	)[ :15 ]
	
	positive_words = sum(
		1
		for word in words
		if vader.lexicon.get(word, 0) > 0
	)
	
	negative_words = sum(
		1
		for word in words
		if vader.lexicon.get(word, 0) < 0
	)
	
	return {
		'text'                     : text,
		'model'                    : 'DistilBERT SST-2 + VADER Ensemble',
		'model_label'              : final_label,
		'model_score'              : round(final_score * 100, 1),
		'model_raw_label'          : model_raw_label,
		'model_raw_score'          : round(model_raw_score * 100, 1),
		'vader_label'              : final_label,
		'vader_compound'           : round(vader_compound, 3),
		'vader_raw_label'          : vader_raw_label,
		'vader_positive'           : vader_positive,
		'vader_negative'           : vader_negative,
		'vader_neutral'            : vader_neutral,
		'vader_positive_sentences' : vader_positive_sentences,
		'vader_negative_sentences' : vader_negative_sentences,
		'vader_neutral_sentences'  : vader_neutral_sentences,
		'agreement'                : True,
		'sentence_results'         : sentence_results,
		'keywords'                 : keywords,
		'word_count'               : len(words),
		'character_count'          : len(text),
		'sentence_count'           : sentence_count,
		'positive_word_count'      : positive_words,
		'negative_word_count'      : negative_words,
		'model_chunk_count'        : len(model_chunks),
	}
