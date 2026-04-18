<%@ CODEPAGE="65001" %>
<html>
<head><meta http-equiv="Content-Type" content="text/html; charset=utf8" /></head>
<body>

<br>演示内容：采用ASP进行XML格式采集并分析数据。
<br>付费接口的采集格式与免费接口完全一致
<br>如需使用付费接口，请修改采集为对应地址
<br>如有其它疑问请访问<a href="http://www.byw.bet"><b style="color:#f00">www.byw.bet</b></a>
<br>
<br>采集地址：http://授权api地址<br>
<%
dim url
url = "http://授权api地址"

set xml = Server.CreateObject("Microsoft.XMLHTTP")
xml.Open "GET", url&"?_&"&rnd(), False
xml.Send

set xmlDom = server.createObject("microsoft.xmldom")
xmlDom.async=False
xmlDom.ValidateOnParse=false
xmlDom.load(xml.responseXML)
if xmlDom.ReadyState > 2 Then 
	set rows = xmlDom.documentElement.SelectSingleNode("//xml").ChildNodes
	response.write ("<br>共采集到 "&rows.length&" 行开奖数据：<br>")
	for i = 0 to rows.length - 1
		response.write ("<br>开奖期号："&rows(i).attributes(0).Value)
		response.write ("<br>开奖号码："&rows(i).attributes(1).Value)
		response.write ("<br>开奖时间："&rows(i).attributes(2).Value)
		response.write ("<br>")
	next
end if
%>
</body></html>