console.log("Sanity Check: JS is working!");

$(document).ready(function(){
    $.ajax({
        method: "GET",
        url: "/api/profile/",
        success: ""
    })

});
