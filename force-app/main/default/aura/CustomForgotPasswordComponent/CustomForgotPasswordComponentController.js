({
    handleForgotPassword: function (component, event, helpler) {
        console.log("In handleForgotPassword");
        helpler.handleForgotPassword(component, event, helpler);
    },
    onKeyUp: function(component, event, helpler){
        console.log("In onKeyUp");
    //checks for "enter" key
        if (event.getParam('keyCode')===13) {
            helpler.handleForgotPassword(component, event, helpler);
        }
    }
})