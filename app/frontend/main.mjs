const getActionEndpoint = () => {
    const currentUrl = new URL(window.location.href);
    const params = currentUrl.searchParams;
    let action = params.get("action");
    if (action) {
        return action
    }
    return null;
}

const actionEndpoint = getActionEndpoint();
if(actionEndpoint) {
    const response = await fetch(actionEndpoint);
    const result = await response.json();
    const bookstackElement = document.createElement("div");
    bookstackElement.innerHTML = result;
    document.body.appendChild(bookstackElement);
}