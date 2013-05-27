if(webinos.session.isConnected === undefined) //version 0.7.0
    console.log("Webinos version supported: v0.7.0");
if(webinos.session.isConnected !== undefined){ //version 0.8.0
    if(confirm("Webinos version not officially supported. Do you want to proceed anyway?")==false){
        window.open('','_self','');
        window.close();
    }
}