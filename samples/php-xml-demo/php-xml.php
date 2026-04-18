<?php header("Content-type: text/html; charset=utf-8"); ?>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf8" />
    <meta http-equiv="refresh" content="5">
</head>
<body>
<?php
$now = date('Y-m-d H:i:s');
echo '<br/>演示内容：采用PHP进行XML格式采集并分析数据。';
echo '<br/>付费接口的数据格式与免费接口完全一致';
echo '<br/>如需使用付费接口，请修改采集为对应地址';
echo '<br/>如有其它疑问请访问<a href="http://www.byw.bet/"><b style="color:#f00">www.byw.bet</b></a>';
echo '<br/>';

$src = 'http://授权api地址';
echo "<br/>采集地址：{$src}<br/><br/>";
//防止GET本地缓存，增加随机数
$src .= (strpos($src,'?')>0 ? '&':'?').'_='.time();
$html = file_get_contents($src);
$xml = json_decode(json_encode(simplexml_load_string($html)),true);

if (isset($xml['@attributes']['row'])){
	echo "{$now}共采集到{$xml['@attributes']['row']}行开奖数据：<br/>";
	foreach($xml['row'] as $r){
		$expect = preg_replace("/^(\d{8})(\d{3})$/","\\1-\\2",$r['@attributes']['expect']);
		$opencode = $r['@attributes']['opencode'];
		$opentime = $r['@attributes']['opentime'];
		echo "开奖期号：{$expect}<br/>";
		echo "开奖号码：{$opencode}<br/>";
		echo "开奖时间：{$opentime}<br/>";
		echo '<br/>';
		//TODO: 分析数据、对比数据，并写入数据库
	}
}else{
	echo "采集失败，返回提示：<br/>";
	echo $html;
}
?>
</body>
</html>