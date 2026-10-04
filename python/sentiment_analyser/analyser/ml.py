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


def analyse_text( text ) :
	transformer = get_transformer()
	vader = get_vader()
	
	sentences = [
		sentence.strip()
		for sentence in re.split(r'(?<=[.!?])\s+', text.strip())
		if sentence.strip()
	]
	
	model_result = transformer(text[ :512 ], truncation = True, max_length = 512)[ 0 ]
	
	model_label = model_result[ 'label' ].upper()
	model_score = float(model_result[ 'score' ])
	
	vader_result = vader.polarity_scores(text)
	vader_compound = float(vader_result[ 'compound' ])
	
	if vader_compound >= 0.05 :
		vader_label = 'POSITIVE'
	elif vader_compound <= -0.05 :
		vader_label = 'NEGATIVE'
	else :
		vader_label = 'NEUTRAL'
	
	agreement = model_label == vader_label
	
	sentence_results = [ ]
	
	for sentence in sentences[ :30 ] :
		sentence_result = transformer(
			sentence[ :512 ],
			truncation = True,
			max_length = 512,
		)[ 0 ]
		
		sentence_results.append(
			{
				'text'  : sentence,
				'label' : sentence_result[ 'label' ].upper(),
				'score' : round(float(sentence_result[ 'score' ]) * 100, 1),
			}
		)
	
	words = re.findall(r"\b[\w'-]+\b", text.lower())
	
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
		key = lambda item : (-item[ 1 ], item[ 0 ]),
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
		'text'                : text,
		'model'               : 'DistilBERT SST-2',
		'model_label'         : model_label,
		'model_score'         : round(model_score * 100, 1),
		'vader_label'         : vader_label,
		'vader_compound'      : round(vader_compound, 3),
		'vader_positive'      : round(vader_result[ 'pos' ] * 100, 1),
		'vader_negative'      : round(vader_result[ 'neg' ] * 100, 1),
		'vader_neutral'       : round(vader_result[ 'neu' ] * 100, 1),
		'agreement'           : agreement,
		'sentence_results'    : sentence_results,
		'keywords'            : keywords,
		'word_count'          : len(words),
		'character_count'     : len(text),
		'sentence_count'      : len(sentences),
		'positive_word_count' : positive_words,
		'negative_word_count' : negative_words,
	}
