import { app } from "./start";


/**
* App Variables
*/


const PORT : number = 9090;


/**
* Server Activation
*/


app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});