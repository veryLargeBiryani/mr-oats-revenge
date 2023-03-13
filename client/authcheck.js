function authCheck(){
    const params = new URL(window.location.href).searchParams;
    const accessToken = params.get('access_token');
    if (!accessToken) document.getElementById('login').hidden = false;
    else document.getElementById('commandCenter').hidden = false;
}

export { authCheck };