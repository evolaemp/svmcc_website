import argparse
import collections
import csv
import json
import os



def get_datasets(datasets_dir):
	"""
	Returns the sorted [] of (name, path) tuples of the dataset files found in
	the given directory.
	"""
	res = []
	
	for item in os.listdir(datasets_dir):
		path = os.path.join(datasets_dir, item)
		item = item.split('.')
		if len(item) == 2 and os.path.isfile(path) and item[1] == 'tsv':
			res.append((item[0], path))
	
	return sorted(res)



def read_dataset(dataset_path):
	"""
	Returns the {gloss: [[lang, trans, cog_class],]} dict of the given dataset.
	"""
	data = collections.defaultdict(list)
	
	with open(dataset_path, newline='', encoding='utf-8') as f:
		reader = csv.DictReader(f, delimiter='\t')
		for row in reader:
			data[row['gloss']].append([
				row['language'], row['transcription'], row['cognate_class']])
	
	return dict(data)



def compile_data(datasets_dir, output_path):
	"""
	Returns a helpful string reporting the number of entries taken from each
	dataset for the json output.
	"""
	data = {}
	counts = {}
	
	for name, path in get_datasets(datasets_dir):
		data[name] = read_dataset(path)
		counts[name] = sum([len(li) for li in data[name].values()])
	
	with open(output_path, 'w', encoding='utf-8') as f:
		json.dump(data, f, ensure_ascii=False, sort_keys=True)
	
	return '\n'.join([
		'{}: {} entries'.format(name, counts[name])
		for name in sorted(counts.keys())] + ['wrote {}'.format(output_path)])



"""
The cli
"""
if __name__ == '__main__':
	parser = argparse.ArgumentParser(description=(
		'compiles the webapp\'s json data'))
	parser.add_argument('datasets_dir', help=(
		'the directory from which to read the datasets'))
	parser.add_argument('--output-path', default='app/data/data.json', help=(
		'where the compiled json data will be written; '
		'defaults to app/data/data.json'))
	
	args = parser.parse_args()
	print(compile_data(args.datasets_dir, args.output_path))
