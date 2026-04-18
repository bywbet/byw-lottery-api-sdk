using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Xml;
using LitJson;
using System.Windows.Forms;

namespace OCAPIDemo
{
    public partial class FormDemo : Form
    {
        public FormDemo()
        {
            InitializeComponent();
        }

        private void buttonXml_Click(object sender, EventArgs e)
        {
            try
            {
                string html = api.HttpGet(this.textBoxXml.Text, Encoding.UTF8);
                if (!html.Substring(0, 5).Equals("<?xml", StringComparison.OrdinalIgnoreCase))
                    throw new Exception(html);
                XmlDocument xml = new XmlDocument();
                xml.LoadXml(html);
                this.textBoxXmlResult.Text = "采集方式：UTF8编码标准下的Xml格式\r\n";
                this.textBoxXmlResult.Text += "采集时间：" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff") + "\r\n";
                this.textBoxXmlResult.Text += "采集行数：" + xml.SelectSingleNode("xml").Attributes["row"].Value + "行\r\n";
                foreach (XmlNode node in xml.SelectNodes("xml/row"))
                {
                    this.textBoxXmlResult.Text += "\r\n";
                    this.textBoxXmlResult.Text += "开奖期号：" + node.Attributes["expect"].Value + "\r\n";
                    this.textBoxXmlResult.Text += "开奖号码：" + node.Attributes["opencode"].Value + "\r\n";
                    this.textBoxXmlResult.Text += "开奖时间：" + node.Attributes["opentime"].Value + "\r\n";
                }
            }
            catch (Exception ex) { this.textBoxXmlResult.Text = "采集出现错误：" + ex.Message; }
        }

        private void buttonJson_Click(object sender, EventArgs e)
        {
            try
            {
                string html = api.HttpGet(this.textBoxJson.Text, Encoding.UTF8);

                // 基础校验：只判断是否是 JSON 开头
                if (string.IsNullOrEmpty(html) || string.IsNullOrEmpty(html.Trim()) || !html.TrimStart().StartsWith("{"))
                    throw new Exception("返回内容不是标准JSON格式：" + html);

                JsonData json = JsonMapper.ToObject(html);

                this.textBoxJsonResult.Text = "采集方式：UTF8编码标准下的Json格式\r\n";
                this.textBoxJsonResult.Text +=
                    "采集时间：" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff") + "\r\n";

                // 这里必须对应接口字段 Rows（大写）
                this.textBoxJsonResult.Text +=
                    "采集行数：" + json["Rows"].ToString() + "行\r\n";

                // 这里必须用 Data（大写）
                foreach (JsonData row in json["Data"])
                {
                    this.textBoxJsonResult.Text += "\r\n";

                    // 注意字段名必须保持大小写一致
                    this.textBoxJsonResult.Text +=
                        "开奖期号：" + row["Expect"].ToString() + "\r\n";

                    this.textBoxJsonResult.Text +=
                        "开奖号码：" + row["Opencode"].ToString() + "\r\n";

                    this.textBoxJsonResult.Text +=
                        "开奖时间：" + row["Opentime"].ToString() + "\r\n";
                }
            }
            catch (Exception ex)
            {
                this.textBoxJsonResult.Text = "采集出现错误：" + ex.Message;
            }
        }


        private void label3_Click(object sender, EventArgs e)
        {
            System.Diagnostics.Process.Start("http://www.byw.bet/");
        }

        private void FormDemo_Load(object sender, EventArgs e)
        {

        }
    }
}