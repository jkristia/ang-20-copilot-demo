goal is to create an angular 20 project simulating a block post site, including mock backend

step1:

- create a node nestjs server for backend
	- follow best practices for nestjs
	- expose API for retrieve a list of block posts
	- expose API for post a new block post
	- expose API for update existing blockpost
	- all posts can be kept in memory or simply written to plain json
	- this is just a mock for demo purpose
	- a post must contain
		- date
		- topic
		- message
	- if no posts exist on startup, add 10 mock posts when different dates

- create the client, using angular 20 and material (is it called material componenet?)
	- follow best practices for angular 20
	- use reactive components
	- default main view should be the list of posts nicely formatted
	- add option to add a new post
		- open a popup form, date should automatically be inserted
		- if cancelled, nothing should happen
		- if ok, push the post to the backend
	- have a manual refresh button which will pull latest changes (e.g. post on browser 1 should be reflected on browser 2 when refresh is clicked)
- add a makefile
	- 'run server' should start mock server
	- 'run client' should start client
- model interface between server and client must be in a shared location

step2:
- add update notification
	- any update to the posts on the backend should cause an update on the clients
	- use whichever technology is recommended best practices
- I expect any post on client1 will show almost immediately on client2
	- if client 2 is adding or modifying a post, it must not be interupted, but the update should show aftewards

step3:
- new posts should be highlighted for a brief moment after being added

