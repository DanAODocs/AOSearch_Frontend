var client_name = '';
var search_results;
var current_client;


function cleanClientJSON(clientJSON) {
    for (var name in clientJSON) {
        if (clientJSON[name] == null || clientJSON[name] == undefined || clientJSON[name] == "undefined") {
        	clientJSON[name] = "None";
        }
    }
    return clientJSON;
}


function addJSONElementToHTMLTable(propertyName, property) {
	return "<tr>"+
				"<td>" + propertyName + "</td>" +
		        "<td>"+ property + "</td>"+
			"</tr>";
}


function addJSONElementLinkToHTMLTable(linkName, link) {
	if (link == "None") {
		return "<tr>"+
		        "<td>" + linkName + "</td>" +
		        "<td>"+ link + "</td>"+
			"</tr>";
	} else {
		return "<tr>"+
		        "<td>" + linkName + "</td>"+
				"<td>" + "<a href=\"https://www."+link.replace("http://", "").replace("www.", "")+"\" target=\"_new\">" + link + "</a>"+"</td>"+
			"</tr>";
	}
}


function clientClick(name, id) {
	client_name = name;
	for (var i = 0; i < search_results.length; i++) {
		if (id == search_results[i].objectID) {
			current_client = search_results[i];
			break;
		}
	}
	document.getElementById("current_client_title").innerHTML = client_name + " - " + current_client.type;


	current_client = cleanClientJSON(current_client);

	//console.log(current_client);

	var client_detail_output = document.getElementById('current_client_detail');

	var client_detail_html_string = "<table class=\"table\" rules=\"cols\">";


	client_detail_html_string += addJSONElementLinkToHTMLTable("Primary Domain",current_client.primaryDomain);
	client_detail_html_string += addJSONElementToHTMLTable("Customer Since", current_client.customerSince);
	client_detail_html_string += addJSONElementToHTMLTable("Anniversary Date", current_client.anniversaryDate);
	client_detail_html_string += addJSONElementToHTMLTable("Account Owner", current_client.accountOwner);
	client_detail_html_string += addJSONElementToHTMLTable("Account Manager", current_client.accountManager);
	client_detail_html_string += addJSONElementToHTMLTable("Number of Employees", current_client.numberOfEmployees);
	client_detail_html_string += addJSONElementToHTMLTable("Number of G Suite Seats", current_client.gSuiteSeats);
	client_detail_html_string += addJSONElementToHTMLTable("NDA Executed", current_client.NDAExecuted);
	client_detail_html_string += addJSONElementToHTMLTable("Full Address", current_client.fullAddress);
	client_detail_html_string += addJSONElementToHTMLTable("Number of AODocs Licenses Purchased", current_client.numberOfAODocsLicensesPurchased);
	client_detail_html_string += addJSONElementToHTMLTable("Number of AODocs Licenses Activated", current_client.numberOfAODocsLicensesActivated);
	client_detail_html_string += addJSONElementToHTMLTable("Number of Consumed Users", current_client.numberOfConsumedUsers);
	client_detail_html_string += addJSONElementToHTMLTable("Percent of Consumed Licenses", current_client.percentOfConsumedLicenses);
	client_detail_html_string += addJSONElementToHTMLTable("Domain Status", current_client.domainStatus);

	for (var i = 0; i < current_client.opportunityCount; i++) {
		for (var j = 0; j < current_client.opportunities[i].productCount; j++) {
			var currentProduct = current_client.opportunities[i].products[j];
			client_detail_html_string += "<tr>"+
									        "<td>"+
												currentProduct.name +
											"</td>"+ 
											"<td>"+
												"Quantity: " + currentProduct.quantity + 

												"  Unique Price: " + currentProduct.uniquePrice + 

												"  Amount: " + currentProduct.totalPrice +
											"</td>"+
										"</tr>";
		}
	}

	client_detail_html_string += addJSONElementToHTMLTable("Total Account Price", current_client.totalAccountPrice);
	client_detail_html_string += addJSONElementToHTMLTable("Total Account Quantity", current_client.totalAccountQuantity);


	client_detail_html_string += "</table>";
	
	client_detail_output.innerHTML = client_detail_html_string;

}


var search = instantsearch({
  appId: 'AVGC1RRE08',
  apiKey: '9e51923e7a55c900094bd19fadfa26e8',
  indexName: 'salesforce_accounts',
  urlSync: true
});

search.addWidget(
	instantsearch.widgets.searchBox({
		container: '#searchBox',
		placeholder: 'Search for Clients...',
		cssClasses: {
			input: 'form-control'
		}
	})
);

search.addWidget(
    instantsearch.widgets.hits({
        container: '#hits-container',
        hitsPerPage: 10,
        templates: {
        	allItems:	'<div class="list-group">'+
        			  		'{{#hits}}'+
        			  			'<a href="#" onclick="clientClick(\'{{name}}\', \'{{objectID}}\')" class="list-group-item">'+
        			  				'{{name}}'+
        			  			'</a>'+
        			  		'{{/hits}}'+
        			 	'</div>',
    	},
    	transformData: function (hits) {
    		search_results = hits.hits;
    		return hits;
    	}
    })
);

search.addWidget(
    instantsearch.widgets.pagination({
    	container: '#pagination-container',
    	cssClasses: { 
    		//root: "class='pagination'"
    	}
    })
);

search.start();
