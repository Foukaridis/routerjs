function selectedClients2Session(callback)
{
	selected_clients = new Array();

	if (document.clients_list.UseClient != undefined) {
		if (typeof(document.clients_list.UseClient.length) == "undefined" && typeof(document.clients_list.UseClient) != "undefined") {
			// This must be a freaking single match.
			selected_clients[document.clients_list.UseClient.value] = document.clients_list.UseClient.checked;
		} else if (typeof(document.clients_list.UseClient.length) != "undefined") {
			var len = document.clients_list.UseClient.length;

			for (var i = 0; i < len; i++) {
				selected_clients[document.clients_list.UseClient[i].value] = document.clients_list.UseClient[i].checked;
			}
		}
	}

	xajax_setSelectedClients(selected_clients, callback);

	return false;
}

function submitClients()
{
	selectedClients2Session("window.location = '/pp/sms/sms_send.php?referral=true'");

	return false;
}

function cancel()
{
	window.location = '/pp/sms/sms_send.php?referral=false';
}