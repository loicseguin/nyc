#!/bin/sh

# Compile images
cd images
make
make clean
cd ..

# Clean up
rm -rf _book

Rscript -e "bookdown::render_book('index.Rmd', 'bookdown::gitbook')"
#Rscript -e "bookdown::render_book('index.Rmd', 'bookdown::pdf_book')"
