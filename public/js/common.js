
$("#postTextarea").keyup(event => {
    const value = event.target.value.trim();
    if(value) {
        $("#submitPostButton").prop("disabled",false);
        return;
    }
    $("#submitPostButton").prop("disabled",true);

})