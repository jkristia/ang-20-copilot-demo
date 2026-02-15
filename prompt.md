goal is to create an angular 20 project simulating a block post site, including mock backend

## step1

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

## step2
- add update notification
	- any update to the posts on the backend should cause an update on the clients
	- use whichever technology is recommended best practices
- I expect any post on client1 will show almost immediately on client2
	- if client 2 is adding or modifying a post, it must not be interupted, but the update should show aftewards

## step3
- new posts should be highlighted for a brief moment after being added
	- reloading should not cause any highlighting

## step4
- add a new module 'democonfig', the purpose is to show a config page with multiple edit components
	- keep changes in sync between clients
	- config object must live on the server as it will be shared across all connected clients
	- proposed config interface
		```ts
			enum SelectEnum {
				value1 = 'value_1', // description should be 'Selected Value 1'
				value2 = 'value_2', // description should be 'Selected Value 2'
				value3 = 'value_3', // description should be 'Selected Value 3'
			}
			interface DemoConfig {
				enabled: bool;
				float_value: number;
				int_value: number;
				string_value: string;
				select_value: SelectEnum
			}
		```
	- client side
		- add view under `#/demo-config`
		- edit components should be aligned vertically, centered on the screen
		- add a back button which navigates to the blog post view. This view will later be moved, so it should redirect to a const defined location
		- add a config button, use gear icon, on the blog post page, click this button should navigate to demo-config. again this might change, so use const defined location
		- float editor should allow float characters
		- int editor should allow int characters
		- string and select should only be anbled when  enabled = true
		- changes should be reflected on all connected clients
	- socket must be typed, and interface defined in shared

## step5
- DemoConfig should be changed to a class instance. Current inteface renamed to IDemoConfig
	- the config insyance lives for the duration of the config service
	- each property is exposed through get / set
	- min max validation to be added got
		float_value: -10/10, default 1.01
		int_value: 0/100, default 10
		string_value, max length 20 characters
	- when a value is set from the client (or API), it should be validated and adjusted to min/max value
	- add a last_changed timestamp, this should be updated on any change
	- expose this as a read only field in the client component
	- of course any change is reflected on all clients

## step6
- add a RunningState class and necessary interface.
	- this state should be available system wide
		- should have an num IDLE and RUNNING
		- should have a run_duration int value, min / max - 1 / 30 seconds, default is 5
- change to client
	- the demo-config view should have a top band whic will container the running state, later additional components will be added.
	- the current component should become a component on a page
	- the top bar will contain the running state component
		- show the state as reead only, 'Idle' or 'Runninng'
		- show a 'Run Duration' edit which sets the run_duration value (int value)
		- add a 'Run' button, when clicked the state on the backend should change to 'running' for the duration of run_duration, then back to idle
		- the UI must be updated with state and elapsed time in seconds
		- edit and run button must be disabled when state is not IDLE
	- all edit fields in demo-config.component must be disabled when state is not IDLE
- keep a single shared websocket for all services on client and all gateways on server

## step7
- missed from step6, any API changes is not allowed while state is RUNNING - add this
- add another 2 classed,
	- expose this as a property on the config class.
	- decide for a meaningful name.
	- The purpose of this class is just to add a couple of more settings components on the config page.
	- add at least 4 propeties for each class, bool, number, select, give meaningful names
- add client component for each
	- add components in a collapsible container under the config component
	- both components should be disabled if config enabled is false
- refactor any duplicated code

## step8
- save config (including last_modified timestamp), including block posts to json
	- save 'should just happen'
- load same config on start, this to make settings an posts persistent

## step9
- add a page which initially will contain just a datagrid, ag-grid community but later will have a master-detail view and other components.
	- the backend data should be read from a database later, in this case mocked, and return the employees.csv data
		- later multiple tables will be added, so keep the acccess as a clean  db access layer
	- for now, pass all data to the client, but this might later be changed to a virtual grid scrolling grid with remote data access, so api must include skip / take, and must return full data set size
	- for now, build the table columns entirely on the client side, but keep in mind this later mighe be schema driven
		- create the grid so it can easily be reused for other tables at a later point
	- the page can be access from the posts page, add a 'table icon' button next to the settings button
	- keep a 'Back to posts' button like the settings page



