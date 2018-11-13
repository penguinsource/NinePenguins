Nine Men's Morris Web Game:


Structure:

- Uses socket IO for server to client communication.
- Angularjs front end development.
- Bower used for library dependency management system.


Features:

- Turn based web game between 2 players


Issues:

- Timer does not work accurately


Developer Notes:

Places where you have to change the ip in order for it to work..

public/angularApp/controllers/mainController.js
public/angularApp/services/NineCache.js
app.js (init function, setting the port to listen on)

If you have an ipv6 ip address, type it in browser as such:

ip address: 2601:589:2:5fc0:f959:f5dd:5932:49be
port number: 3000

type: [2601:589:2:5fc0:f959:f5dd:5932:49be]:3000
