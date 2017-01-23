=============
svmcc website
=============

Here lives the source code of `the website`_ that presents the svmcc paper.


data
====

The data comprises the wordlists from the datasets used in the paper, together
with their (1) goldstandard cognate classes, (2) cognate classes inferred
through LexStat, and (3) cognate classes inferred through SVM. All the data is
extracted from the ``data/datasets`` and ``data/inferred`` directories of `the
svmcc repository`_ using the ``bin/compile_data.py`` script. Thus, doing
something like::

    python3 bin/compile_data.py ../svmcc/data/datasets ../svmcc/data/inferred

would reproduce the ``app/data/data.json`` file which is the output of the
script and the data file that the website loads and displays.


code
====

The code comprises a static (front-end only) webapp. It has a few bower
dependencies and is built using a few nodejs tools. To setup, do something
like::

    npm install
    bower install
    npm run watch

The last command also starts a development server on ``localhost:9000``.


licence
=======

The code: MIT. The data: please refer to `the svmcc repository`_.


.. _`the website`: http://www.evolaemp.uni-tuebingen.de/svmcc/
.. _`the svmcc repository`: https://github.com/evolaemp/svmcc
