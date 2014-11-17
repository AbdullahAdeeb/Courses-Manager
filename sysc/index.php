<?php


?>
<html>
	<head>
	</head>
	<body>
		<div id="loginview">
			<form method="post" action="server.php">
				Login : <input type="text" name="login"/><br/>
				Password : <input type="text" name="password"/><br/>
				Major: <select name="major"><option value="sysc">SYSC</option></select>
				<input type="hidden" value="login" name="typeofrequest"/>
				<input type="submit" value="Login"/>
			</form>
		</div>
	</body>
</html>