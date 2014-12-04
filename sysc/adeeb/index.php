<?php
?>

<html>	
	<head>
		<title>SYSC Scheduler </title>
	<head>
	
	<body>
	<script src="functions.js">
	</script>
		<center><img src="CarletonLogo.gif" alt="Carleton Univeristy" style="width:750px;height:228px"></center>
		<center>
			<form id="loginview" method="POST" action="server.php">
				Username: <input type="text" name="username" placeholder="username">&nbsp Password: <input type="password" name="pwd" placeholder="********">
				
				<input type="submit" value="login">
				<input type="hidden" value="login" name="typeofrequest"/>
			</form>
			<b>Major:</b>
			<select name="major" form="loginview">
						<option value="sysc">SYSC</option>
			</select>			
			
		</center>
		
	</body>
</html>
