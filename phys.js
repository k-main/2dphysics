const API_endpoint = "http://192.168.5.245:3001/auth"

document.addEventListener("DOMContentLoaded", async () => {

    document.getElementById('submitButton').addEventListener('click',
        async (event) => {
            event.preventDefault();
            var uname = document.getElementById("uname").value;
            var pw = document.getElementById("pw").value;

            const postData = `{
                "username" : "${uname}",
                "password" : "${pw}"
            }`

            // console.log(`${uname}, ${pw}`)
            // console.log("Trying to sign in.")
            const res = await fetch(API_endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: postData
            })

            console.log(res)
            // const login_attempt = await res.json();
            // console.log(login_attempt)
            // console.log(res)
        }
    )
})