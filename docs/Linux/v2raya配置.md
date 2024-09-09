# v2rayA 配置

主要参考[这篇博客](https://manateelazycat.github.io/2023/06/23/best-proxy/)。

官方文档也有[说明](https://v2raya.org/docs/advanced-application/intranet-direct/)。

配置:

* Transport Proxy/System Proxy -> On: Traffic Splitting Mode is the Same as the Rule Port
* Transparent Proxy/System Proxy Implementation -> redirect
* Traffic Splitting Mode of Rule Port -> Routing A
	* configuration of Routing A  
```bash
default: proxy
# write your own rules below
domain(domain:mail.qq.com)->direct

domain(geosite:google-scholar)->proxy
domain(geosite:category-scholar-!cn, geosite:category-scholar-cn)->direct
domain(geosite:geolocation-!cn, geosite:google)->proxy
domain(geosite:cn)->direct
ip(geoip:hk,geoip:mo)->proxy
ip(geoip:private, geoip:cn)->direct

domain(domain:qq.com, domain:163.com, domain:bilibili.com, domain:sunlogin.oray.com)->direct
domain(domain:chatgpt.com)->proxy
```

* Prevent DNS Spoofing -> DoH(dns-over-https)
* Special Mode -> supervisor
* TCPFastOpen -> Keep Default
* Multiplex -> Off
* Automatically Update Subscriptions -> Update Subscriptions When Service Starts
* Mode when Update Subscriptions and GFWList -> Do not Split Traffic
<!--stackedit_data:
eyJoaXN0b3J5IjpbMTA2NjkwNTk0NCwyNzUwMTQ4NDMsNzg1OT
k5NTM4XX0=
-->