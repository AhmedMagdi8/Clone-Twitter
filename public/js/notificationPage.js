$(document).ready(() => {
    $.get("/api/notifications", (data) => {
        outputNotificationList(data, $(".resultsContainer"));
        
    })
});

$("#markNotificationsAsRead").click(() => markNotificationAsOpened());


function outputNotificationList(notificatins, container) {
    notificatins.forEach(element => {
        let html = createNotificationHtml(element);
        container.append(html);
        
    });
    if(notificatins.length == 0) {
        container.append("<span class='noResults'> Nothing to show.</span>")
    }
}


function createNotificationHtml(notification) {
    const userFrom = notification.userFrom;
    const text = getNotificationText(notification);
    const url = getNotificationUrl(notification);
    const className = notification.opened? "" : "active";

    return `<a class="resultsListItem notification ${className}" href="${url}" data-id="${notification._id}">
                <div class="resultsImageContainer">
                    <img src='${userFrom.profilePic}'>
                </div>
                <div class="resultsDetailsContainer ellipsis">
                    ${text}
                </div>
            </a>`
}

function getNotificationText(notification) {

    const userFrom = notification.userFrom;


    if(!userFrom.firstName || !userFrom.lastName) {
        return alert("User from data not populated");
    }

    let userFromName = userFrom.firstName + " " + userFrom.lastName;
    let text;

    if(notification.notificationType == "retweet") {
        text = userFromName + " retweeted one of your posts"
    }

    else if(notification.notificationType == "postLike") {
        text = userFromName + " liked one of your posts"
    }

    else if(notification.notificationType == "reply") {
        text = userFromName + " replyed to one of your posts"
    }
    
    else if(notification.notificationType == "follow") {
        text = userFromName + " followed you"
    }
    return `<span class="ellipsis">${text}</span>`
}





function getNotificationUrl(notification) {

    let url='#';

    if( notification.notificationType == "retweet" || 
        notification.notificationType == "postLike" || 
        notification.notificationType == "reply") {

            url = '/posts/'+ notification.entityId;

    }

    else if(notification.notificationType == "follow") {
            url = '/profile/'+ notification.entityId;
    }
    return url;
}