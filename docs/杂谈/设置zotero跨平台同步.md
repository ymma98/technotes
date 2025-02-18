# 设置 zotero 跨平台同步

两种办法：WebDAV, 网盘+zotfile/zotero-attanger

## WebDAV

需要网盘支持 webdav 功能才可以。经过各种尝试，结论：

* [infiniCloud](https://infini-cloud.net/en/) 就是最好的选择。免费用户就有20G的容量，并且支持 webdav 功能，对于 zotero 的使用是基本足够的。

* 坚果云。太贵了，而且网上说[坚果云会存在误删文件的问题](https://www.zhihu.com/question/443637707/answer/2063893553)，当然，不只是这一个帖子

* pCloud (付费用户)。pCloud 不支持免费用户使用 webdav。但 pCloud 存在 350欧元左右买断终身 2T 云盘的付费套餐，并且各个平台的支持做的也很好。pCloud 是很好的云盘，数据备份在美国或欧盟，但是在国内网速太慢了，上传下载只有几十KB, webdav 经常出现掉线的情况。这么好的一个网盘国内却因为网络问题被限制使用，实在是可惜


## 网盘+ zotfile/zotero-attanger

知乎上这个[帖子](https://zhuanlan.zhihu.com/p/31453719)是较为详细的教程。

总的来说，就是通过 zotfile 或者 zotero-attanger 插件，将所有的文献都存储在网盘文件夹内，并且存储的文件名和文件夹结构和 zotero 界面看到的一样。

网盘：

* Onedrive, 学校邮箱可以直接申请 1T 的免费空间。我之前一直是用的这个方法。虽然Onedrive在linux平台上不好用，但1T的免费空间是非常慷慨的，足以抵消其它任何不足。然而，如今华科已经不再允许终身使用学校邮箱，毕业就销户。

* Google drive. 免费15G空间

* 坚果云 

我怀疑zotero产品将存储的文件名设置为乱码是出于一种恶意？让大家购买其同步功能，而不是可以方便地在没有 zotero 的环境中工作。如果早知道 zotero 是以乱码的形式存储文件，我或许一开始就不会使用 zotero，但是发觉的时候已经晚了。

注意：

* zotfile 仅支持 zotero 6，并且作者无意更新支持 zotero 7.

* [`zotero-attanger`](https://github.com/MuiseDestiny/zotero-attanger) 支持 zotero 7, 并实现了和 zotfile 一样的功能。


## 最佳实践

使用 webdav + [infiniCloud](https://infini-cloud.net/en/)

infiniCloud 本身也将对zotero的便捷支持作为一个很大的卖点。

说实话，如果国内不对 pCloud 作限制，pCloud 简直是最理想的网盘了。
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTE0MDE2MzE4MTcsLTE2MDEyOTQzMDldfQ
==
-->