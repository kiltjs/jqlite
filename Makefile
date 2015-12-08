# --- jqlite

test:
	@node make test
	@$(shell npm bin)/karma start karma.conf.js
	@$(shell npm bin)/karma start karma.min.js

dev:
	@node make dev

live:
	@node make live

git.increaseMasterVersion:
	git fetch origin
	git checkout master
	git pull origin master
	node make pkg:increaseVersion

git.increaseVersion: git.increaseMasterVersion
	git commit -a -n -m "increased version [$(shell node make pkg:version)]"
	@git push origin master

release: test git.increaseVersion
	npm publish
	@echo "\n\trelease version $(shell node make pkg:version)\n"

echo:
	@echo "make options: test dev live release"

# DEFAULT TASKS

.DEFAULT_GOAL := echo
