SRCS = $(wildcard *.tex)
PDFS = $(patsubst %.tex,%.pdf,$(SRCS))

%.pdf: %.tex
	pdflatex --shell-escape $<

all: $(PDFS)

.PHONY: clean

clean:
	latexmk -c
	rm -f *.synctex*


