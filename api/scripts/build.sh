#!/bin/bash
swc src -d dist --copy-files -s false
mkdir -p assets/katex/fonts
cp node_modules/katex/dist/katex.min.css assets/katex/katex.min.css
cp node_modules/katex/dist/fonts/* assets/katex/fonts