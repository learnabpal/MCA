import re
from functools import lru_cache

from transformers import pipeline
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer




MODEL_NAME = 'distilbert/distilbert-base-uncased-finetuned-sst-2-english'


@lru_cache(maxsize = 1)
def get_transformer() :
	return pipeline(
		'sentiment-analysis',
		model = MODEL_NAME,
		tokenizer = MODEL_NAME,
		device = -1,
	)


@lru_cache(maxsize = 1)
def get_vader() :
	return SentimentIntensityAnalyzer()


def word_count( t ) : return re.findall(r"\b[\w'-]+\b", t.lower())


def analyse_text( text ) :
	transformer = get_transformer()
	vader = get_vader()
	
	sentences = [
		sentence.strip()
		for sentence in re.split(r'(?<=[.!?])\s+', text.strip())
		if sentence.strip()
	]
	
	model_chunks = [ ]
	
	for start in range(0, len(text), 1800) :
		chunk = text[ start :start + 1800 ]
		model_result = transformer(chunk, truncation = True, max_length = 512)[ 0 ]
		model_chunks.append(model_result)
	
	model_positive = sum(
		float(result[ 'score' ])
		if result[ 'label' ].upper() == 'POSITIVE'
		else 1 - float(result[ 'score' ])
		for result in model_chunks
	) / len(model_chunks)
	
	model_negative = 1 - model_positive
	model_label = 'POSITIVE' if model_positive >= model_negative else 'NEGATIVE'
	model_score = max(model_positive, model_negative)
	
	vader_result = vader.polarity_scores(text)
	vader_compound = float(vader_result[ 'compound' ])
	
	if vader_compound >= 0.05 :
		vader_label = 'POSITIVE'
	elif vader_compound <= -0.05 :
		vader_label = 'NEGATIVE'
	else :
		vader_label = 'NEUTRAL'
	
	sentence_results = [ ]
	vader_sentence_labels = [ ]
	
	for sentence in sentences :
		sentence_result = transformer(
			sentence,
			truncation = True,
			max_length = 512
		)[ 0 ]
		
		sentence_vader = vader.polarity_scores(sentence)
		sentence_compound = float(sentence_vader[ 'compound' ])
		
		if sentence_compound >= 0.05 :
			sentence_vader_label = 'POSITIVE'
		elif sentence_compound <= -0.05 :
			sentence_vader_label = 'NEGATIVE'
		else :
			sentence_vader_label = 'NEUTRAL'
		
		vader_sentence_labels.append(sentence_vader_label)
		
		sentence_results.append(
			{
				'text'           : sentence,
				'label'          : sentence_result[ 'label' ].upper(),
				'score'          : round(float(sentence_result[ 'score' ]) * 100, 1),
				'vader_label'    : sentence_vader_label,
				'vader_compound' : round(sentence_compound, 3),
				'token_count'    : len(word_count(sentence)),
			}
		)
	
	sentence_count = len(sentences)
	
	vader_positive_sentences = vader_sentence_labels.count('POSITIVE')
	vader_negative_sentences = vader_sentence_labels.count('NEGATIVE')
	vader_neutral_sentences = vader_sentence_labels.count('NEUTRAL')
	
	vader_positive = round(vader_positive_sentences / sentence_count * 100, 1) if sentence_count else 0
	vader_negative = round(vader_negative_sentences / sentence_count * 100, 1) if sentence_count else 0
	vader_neutral = round(vader_neutral_sentences / sentence_count * 100, 1) if sentence_count else 0
	
	agreement = model_label == vader_label
	
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
		'model'                    : 'DistilBERT SST-2',
		'model_label'              : model_label,
		'model_score'              : round(model_score * 100, 1),
		'vader_label'              : vader_label,
		'vader_compound'           : round(vader_compound, 3),
		'vader_positive'           : vader_positive,
		'vader_negative'           : vader_negative,
		'vader_neutral'            : vader_neutral,
		'vader_positive_sentences' : vader_positive_sentences,
		'vader_negative_sentences' : vader_negative_sentences,
		'vader_neutral_sentences'  : vader_neutral_sentences,
		'agreement'                : agreement,
		'sentence_results'         : sentence_results,
		'keywords'                 : keywords,
		'word_count'               : len(words),
		'character_count'          : len(text),
		'sentence_count'           : sentence_count,
		'positive_word_count'      : positive_words,
		'negative_word_count'      : negative_words,
		'model_chunk_count'        : len(model_chunks),
	}
