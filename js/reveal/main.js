// More info https://github.com/hakimel/reveal.js#configuration
Reveal.initialize({
	history: true,

	// More info https://github.com/hakimel/reveal.js#dependencies
	dependencies: [
		{ src: '/js/reveal/plugin/markdown/marked.js' },
		{ src: '/js/reveal/plugin/markdown/markdown.js' },
		{ src: '/js/reveal/plugin/notes/notes.js', async: true },
		{ src: '/js/reveal/plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } }
	]
});
