
# where FORMAT is either s5, slidy, slideous, dzslides, or revealjs.
WEB_FORMAT = slidy

build: .FORCE clean html

html: presentation1.md presentation2.md presentation3.md
	pandoc -V lang=en -s -t $(WEB_FORMAT) presentation1.md -o presentation1.html
	git add presentation1.html
	pandoc -V lang=en -s -t $(WEB_FORMAT) presentation2.md -o presentation2.html
	git add presentation2.html
	pandoc -V lang=en -s -t $(WEB_FORMAT) presentation3.md -o presentation3.html
	git add presentation3.html

pdf: .FORCE
	pandoc -V lang=en -s -t beamer presentation1.md -o presentation1.pdf
	pandoc -V lang=en -s -t beamer presentation2.md -o presentation2.pdf
	pandoc -V lang=en -s -t beamer presentation3.md -o presentation3.pdf

pptx: .FORCE
	pandoc -V lang=en -s presentation1.md -o presentation1.pptx
	pandoc -V lang=en -s presentation2.md -o presentation2.pptx
	pandoc -V lang=en -s presentation3.md -o presentation3.pptx

clean: .FORCE
	if [ -f index.html ]; then rm presentation/*.html; fi
	if [ -f CMTools-presentation.pdf ]; then rm presentation/*.pdf; fi
	if [ -f CMTools-presentation.pptx ]; then rm presentation/*.pptx; fi

.FORCE:
