#!/bin/bash
swc prisma -d dist --copy-files
mkdir -p assets/katex/fonts
cp node_modules/katex/dist/katex.min.css assets/katex/katex.min.css
cp node_modules/katex/dist/fonts/* assets/katex/fonts
# Compile/copy and watch src directory
swc src -d dist --copy-files -w