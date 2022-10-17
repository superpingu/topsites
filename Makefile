SHELL = /bin/zsh
PORT = 3232
REQUEST = $(shell { echo -ne "HTTP/1.0 200 OK\r\n\r\n"} | nc -l localhost $(PORT) | grep 'GET /site/')
SITE_TO_CAPTURE = $(patsubst /site/%/,%, $(filter /site/%/,$(REQUEST)))

server:
	while true ; do make waitrequest; done

waitrequest:
	make capture topsites.html SITE=$(SITE_TO_CAPTURE) &

capture:
	@echo $(SITE) | grep -e '[0-9]'
	@mkdir -p sites/
	screencapture -x -T 3 -R0,120,2992,1869 -tjpg sites/$(SITE).jpg
	mogrify -quality 20% sites/$(SITE).jpg

topsites.html: sitepics.js
	jade topsites.jade

SITE_IMGS = $(wildcard sites/*.jpg)

sitepics.js:
	echo "const sitepics = {" > $@
	make $(SITE_IMGS:.jpg=.base64)
	echo "}" >> $@

%.base64:
	@echo -ne "	'$(notdir $*)': 'data:image/jpeg;base64, " >> sitepics.js
	@base64 $*.jpg | tr -d '\n' >> sitepics.js
	@echo "'," >> sitepics.js

.PHONY: sitepics.js topsites.html
