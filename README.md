# Digaai Visualization Portal

This is a joint project with Boston University Spark! and Digaai.

It represents census data for Brazilian immigrants in America.

This uses "all_data.csv" as the main resource for data.
"all_data.csv" represents population count for various subgroups in each state.
Each column is an individual state and each row is a subgroup of Brazilian Americans.
Except for a couple at the end represent median income in each state.
The states are in alphabetical order. E.g.
  01      02      03       04       05         06      07         08         09                   10     11    12
  ^       ^       ^        ^         ^          ^      ^          ^          ^                    ^      ^     ^
Alabama Alaska Arizona Arkansas California Colorado Connecticut Delaware District of Columbia Florida Georgia Hawaii

### Local Execution
Assuming you have PHP installed, run:
<br/><code>./local</code> and PHP will spawn a local HTTP server on 127.0.0.1:3000 

### Remote Deploy
This requires that you have access to the Digaai Heroku app. Contact <a href="mailto: dharmesh@cs.bu.edu">Dharmesh</a> with your Heroku username/email to request push access to the Heroku remote and then setup the Heroku remote to point to the app at https://digaai.herokuapp.com

After, push changes to the Heroku remote.

<strong>NB: Composer is solely used for Heroku to know that this is a PHP app at this time. Be sure to update the local execution script and README if you configure this app to include dependencies in the future.</strong>