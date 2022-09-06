@@ -1,8 +1,16 @@
import { useState, useEffect } from 'react';
import './App.css';

+
	+function getCookie(name) {
		+  const value = `; ${document.cookie}`;
		+  const parts = value.split(`; ${name}=`);
		+  if (parts.length === 2) return parts.pop().split(';').shift();
		+}
+
+
	function App() {
		-  const [token, setToken] = useState()
		+  const [isLoggedIn, setIsLoggedIn] = useState(true)
		const [loading, setLoading] = useState()
		const [formUsername, setFormUsername] = useState()
		const [formPassword, setFormPassword] = useState()
	@@ -12,15 +20,15 @@
		const [ email, setEmail] = useState('')
		const [ dateJoined, setDateJoined] = useState('')
		const [ error, setError] = useState()
		+  const csrftoken = getCookie('csrftoken')

		useEffect(() => {
			-    if (token) {
				+    if (isLoggedIn) {
					fetch(
						'/api/user',
						{
							headers: {
									'Content-Type': 'application/json;charset=utf-8',
								-          'Authorization': `Token ${token}`,
				},
				}
				)
				@@ -42,9 +50,10 @@
					.catch(error => {
						console.log(error)
						setError('Ошибка, подробности в консоли')
						+        setIsLoggedIn(false)
					})
				}
				-  }, [token])
			+  }, [isLoggedIn])

		const submitHandler = e => {
			e.preventDefault();
		@@ -55,6 +64,7 @@
			method: 'POST',
				headers: {
				'Content-Type': 'application/json;charset=utf-8',
					+          'X-CSRFToken': csrftoken,
			},
			body: JSON.stringify({
				username: formUsername,
				@@ -70,7 +80,7 @@
			}
		})
	.then(({key}) => {
			-        setToken(key)
			+        setIsLoggedIn(true)
			setError(null)
		})
			.catch(error => {
			@@ -83,7 +93,7 @@
			return (
					<div className="App">
						{error? <p>{error}</p> : null}
						-      {!token?
						+      {!isLoggedIn?
							loading? "Загрузка..." :
								<form className="loginForm" onSubmit={submitHandler}>
									<input type="text" name="username" value={formUsername} onChange={e => setFormUsername(e.target.value)} placeholder="Username"/>