var zigTP=1.0125;

function zigGetUSDT(obj){
	if(obj.innerHTML.indexOf('€')<0) {
	amount_usdt=obj.innerHTML.replace(' USDT','')*1;
	if(amount_usdt==0){
		obj.innerHTML='<font style=font-weight:normal;color:gray>0</font>';
	} else {
		amount_eur=Math.round(100*usdt*amount_usdt)/100;
			obj.innerHTML=amount_eur+'<b style=font-weight:normal;margin-left:4px;color:#E2AF00>€</b> ~ <font style="font-weight:normal">'+obj.innerHTML+'</font><b style=font-weight:normal;margin-left:4px;color:#26A17B>Ŧ</b>';
		}
	}
}

function zigAddEURHTML(k){
	switch(window.location.href){
		case "https://zignaly.com/app/dashboard/balance":
		case "https://zignaly.com/app/dashboard/balance/":
			if(document.querySelectorAll('.MuiTypography-root.value.MuiTypography-body1').length>3){
				objs=document.querySelectorAll('.MuiTypography-root.value.MuiTypography-body1');
				for(i=0;i<3;i++){
					zigGetUSDT(objs[i]);
				}
				tabs=document.querySelector('tbody').querySelectorAll('div,td');
				for(i=0;i<tabs.length;i++){
					if(tabs[i].innerHTML.indexOf('USDT')>0 && tabs[i].innerHTML.indexOf('<')<0){
						zigGetUSDT(tabs[i+1]);
					}
				}
				var usdt_days=[];
				var usdt_adds=[];
				var usdt_gain=[];
				for(i=1;i<tabs.length;i++){
					if(tabs[i].innerHTML=="DATE"){
						if(tabs[i+1].innerHTML.indexOf('</b>')<0){
							k=1;
							for(j=2;j<50;j++){
								if(tabs[i+j].dataset.colindex==7){
									k=j;
									j=50;
								}
							}
							usdt_days.push(1*tabs[i+k].getElementsByTagName('font')[0].innerHTML);
							
						}
					}
					if(tabs[i].innerHTML=="Daily Profit and Loss USDT"){
						usdt_gain.push(1*tabs[i+1].getElementsByTagName('font')[0].innerHTML);
					}
					
					
					if(tabs[i].innerHTML=="Net Transfer USDT"){
						usdt_adds.push(1*tabs[i+1].getElementsByTagName('font')[0].innerHTML);
					}
				}
				
				for(i=0;i<tabs.length;i++){
					if(tabs[i].innerHTML=="DATE"){
						if(tabs[i+1].innerHTML.indexOf('</b>')<0){
							if(usdt_days.length>1) {
								if(usdt_gain[0]==0) {
									evol=0;
								} else {
									if(usdt_adds[0]>0) {
										evol=Math.round(10000*usdt_gain[0]/(usdt_days[0]-usdt_gain[0]))/100;
									} else {
										evol=Math.round(10000*(usdt_days[0]/usdt_days[1]-1))/100;
									}
								}
							
								usdt_days.shift();
								usdt_adds.shift();
								usdt_gain.shift();
								html=" <b style=color:#03A9F4>";
								if(evol>=0) html+='+';
								html+=evol+'%</b>';
								if(evol>=2) img='http://www.soudy.fr/perf/rocket.svg';
								else if(evol>=1.5) img='http://www.soudy.fr/perf/fire.svg';
								else if(evol>=1) img='http://www.soudy.fr/perf/sunny.svg';
								else if(evol>=0.66) img='http://www.soudy.fr/perf/sunny66.svg';
								else if(evol>=0.33) img='http://www.soudy.fr/perf/sunny33.svg';
								else if(evol>=0) img='http://www.soudy.fr/perf/cloudy.svg';
								else if(evol>=-1) img='http://www.soudy.fr/perf/rainy.svg';
								else if(evol>=-2) img='http://www.soudy.fr/perf/storm.svg';
								else img='http://www.soudy.fr/perf/meteorite.svg';
								tabs[i+1].innerHTML='<img style="float:left;width:36px;height:36px;margin:-7px 8px 0px 0px;" src='+img+'>'+tabs[i+1].innerHTML+html;
							} else if(tabs[i+1].innerHTML.indexOf('img')<0) {
								tabs[i+1].innerHTML='<img style="float:left;width:36px;height:36px;margin:-7px 8px 0px 0px;" src=http://www.soudy.fr/perf/sunny.svg>'+tabs[i+1].innerHTML;
							}
						}
					}
				}
				
				
				fonts=document.querySelectorAll('font');
				for(i=0;i<fonts.length;i++){
					fonts[i].innerHTML=fonts[i].innerHTML.replace(' USDT','');
				}
			} else if(k<10) {
			setTimeout(function(){
				zigAddEURHTML(k+1)
			},1000);
			}
			break;
		case "https://zignaly.com/app/dashboard":
		case "https://zignaly.com/app/dashboard/":
			if(document.querySelector('tbody')){
				tabs=document.querySelector('thead').querySelectorAll('div');
				for(i=1;i<tabs.length;i++){
					switch(tabs[i].innerHTML){
						case "MARGIN MODE":
							tabs[i].innerHTML="SELL ORDER"
							break;
						case "INITIAL AMOUNT":
							tabs[i].innerHTML="POTENTIAL GAIN"
							break;
					}
				}
				
				tabs=document.querySelector('tbody').querySelectorAll('div,td');
				var aep=1;
				for(i=1;i<tabs.length;i++){
					switch(tabs[i].innerHTML){
						case "AVERAGE ENTRY PRICE":
							aep=1*tabs[i+1].innerHTML.replace(/(<([^>]+)>)/gi, "").substr(5);
							break;
						case "MARGIN MODE":
							tabs[i+1].innerHTML='<span class=gain>'+Math.round(100000*aep*zigTP)/100000+'</span>';
							break;
						case "INITIAL AMOUNT":
							nbr=1*tabs[i+1].innerHTML.substr(tabs[i+1].innerHTML.indexOf('</span>')+7).replace(' ','');
							tabs[i+1].innerHTML='<span class=gain style=color:#03A9F4>'+Math.round(100*(aep*zigTP-aep)*nbr)/100+'</span>';
							break;

					}
				}
				symbols=document.querySelectorAll('span.symbol');
				for(i=0;i<symbols.length;i++){
					symbols[i].innerHTML="";
				}
				zigDashboardTitle();
			}else{
				if(k<300) {
					setTimeout(function(){
						zigAddEURHTML(k+1)
					},100);
				}
			}
			break;
	}
}
var usdt=0.82;
function zigGetChange(){
	usdt_temp=zigCookie({variable:'usdt'});
	if(usdt_temp){
		usdt=usdt_temp;
		zigAddEURHTML(0);
	}else{
		var XHR = new XMLHttpRequest();
		XHR.onreadystatechange = function(){
			if(XHR.readyState === 4 && XHR.status === 200) {
				data=JSON.parse(XHR.responseText);
				usdt=data['EUR'];
				zigCookie({variable:'usdt',value: usdt, delayInHours: 12});
				zigAddEURHTML(0);
			}
		}
		XHR.open('GET', 'https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=EUR');
		XHR.send();
	}
}

function zigDashboardTitle(){
	tabs=document.querySelector('tbody').querySelectorAll('div,td');
	var title="";
	for(i=1;i<tabs.length;i++){
		switch(tabs[i].innerHTML){
			case "PAIR":
				tabs[i+1].innerHTML=tabs[i+1].innerHTML.replace('/USDT','');
				if(title.length>0) title+=' | ';
				title+=tabs[i+1].innerHTML+' ';
				break;
			case "P/L %":
				value=tabs[i+1].getElementsByTagName('span')[0].innerHTML.replace(' ','');
				title+=value;
				break;
		}
	}
	window.document.title=title;
	setTimeout(function(){
		zigDashboardTitle();
	},1000)
}


function zigCookie(options) {
	if (typeof(options.value) != 'undefined') {
		let date = new Date();
		date.setTime(date.getTime() + (options.delayInHours * 3600000));
		host = location.host.split('.');
		if (host.length > 2) {
			host.shift();
		}
		document.cookie = options.variable + '=' + options.value + '; expires=' + date.toGMTString() + '; secure; path=/;domain=.' + host.join('.');
	} else {
		let start = document.cookie.indexOf(options.variable + '=') + 1;
		if (start > 0) {
			end = document.cookie.indexOf(';', start + options.variable.length + 1);
			if (end > 0) {
				return unescape(document.cookie.substring(start + options.variable.length, end));
			} else {
				return unescape(document.cookie.substring(start + options.variable.length, document.cookie.length));
			}
		} else {
			return '';
		}
	}
}

zigGetChange();

var currentPage = location.href;
setInterval(function(){
    if (currentPage != location.href)
    {
        currentPage = location.href;
		zigAddEURHTML(0);
    }
}, 500);
