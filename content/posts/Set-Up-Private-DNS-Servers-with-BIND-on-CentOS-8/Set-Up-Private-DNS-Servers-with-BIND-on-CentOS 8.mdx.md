---
title: 在 CentOS 8 上安装和配置 DNS Server
date: 2021-06-21

tags:
  - DNS
---

import SpotifyPlayer from "./SpotifyPlayer";

BIND(berkeley Internet Name Domain) 是 90 年代 berkeley 大学的一个学生开发的一款开源软件:thumbsup::thumbsup:，用来在 Linux 操作系统上提供 DNS(Domain Name System) 解析服务。 DNS 服务可以用来将系统或应用的 FQDN(fully qualified domain name) 解析为 IP地址，反过来也可以将 IP 地址解析为 FQDN 名字。BIND 还有很多高级的特性，比如负载均衡、动态更新、DNS 拆分等，由于实际使用比较少，所以在本篇博文中不会介绍。

### 1. 更新系统

登录上 CentOS 8 操作系统，更新系统的软件包：

```
dnf update -y
```

### 2. 安装 BIND 软件

安装软件：

```
dnf install bind bind-utils -y
```

激活服务：

```
systemctl start named
systemctl enable named
```

启动之后可以检查 BIND 服务的状态：

```
named -V
ss -lnptu | grep named
rndc status
```

### 3. 配置 BIND 服务

默认配置中， BIND 服务只监听在 localhost 上，先将监听改到系统的 IP 网卡地址上。

编辑配置文件：

```title=/etc/named.conf {6,}
vi /etc/named.conf

...
//listen-on port 53 { 127.0.0.1; };
//listen-on-v6 port 53 { ::1; };
// 允许 192.168.2.0 网段的客户端查询
allow-query     { localhost;192.168.2.0/24; };
...
```

### 4. 创建正向和反向 DNS 域

正向域是用来将 FQDN 解析为 IP 地址，反向域则是将 IP 地址解析为 FQDN。通常情况下，大多数 DNS 查询都是正向查询。


编辑配置文件，添加以下内容：

```title=/etc/named.conf
vi /etc/named.conf

...
//Forward Zone
zone "h1ya.local" IN { 

           type master;  
           file "h1ya.local.db"; 
           allow-update { none; };  

};

//Reverse Zone
zone "2.168.192.in-addr.arpa" IN { 

             type master;  
             file "192.168.2.db";             
             allow-update { none; };

};
...
```

- **type** 指定当前区域的服务器角色，属性「master」表示这是一个 **authoritative** 服务器。
- **allow-update** 定义允许转发动态 DNS 更新的服务器，本环境没有。

> h1ya.local 是我自己的测试域名，你应该更改为你的域名。

### 5. 创建正向和反向域文件

在 **/var/named** 目录中创建上一步配置中的正向域文件和反向域文件。

首先创建正向域文件：

```
cat > /var/named/h1ya.local.db << EOF
\$TTL 86400
@   IN  SOA     ns1.h1ya.local. root.h1ya.local. (
                                              3           ;Serial
                                              3600        ;Refresh
                                              1800        ;Retry
                                              604800      ;Expire
                                              86400       ;Minimum TTL
)

;Name Server Information
@       IN  NS      ns1.h1ya.local.

;IP address of Name Server
ns1       IN  A       192.168.2.151

;Mail Server MX (Mail exchanger) Record
h1ya.local. IN MX 10 mail.h1ya.local.

;A - Record HostName To Ip Address
www      IN  A       192.168.2.32
mail     IN  A       192.168.2.33

;CNAME record
ftp     IN CNAME        www.h1ya.local.
EOF
```

然后创建反向域文件：

```
cat << EOF > /var/named/192.168.2.db
\$TTL 86400
@   IN  SOA     ns1.h1ya.local. root.h1ya.local. (
                                       3           ;Serial
                                       3600        ;Refresh
                                       1800        ;Retry
                                       604800      ;Expire
                                       86400       ;Minimum TTL
)

;Name Server Information
@         IN      NS         ns1.h1ya.local.

;Reverse lookup for Name Server
151       IN  PTR     ns1.h1ya.local.

;PTR Record IP address to HostName
32      IN  PTR     www.h1ya.local.
33      IN  PTR     mail.h1ya.local.
EOF
```

> 域名都应该以「.」结尾。

一些参数的说明：

- **TTL**：Time-To-Live 的缩写。TTL是一个数据包在被路由器丢弃之前存活于网络中的持续时间（或跳数）。

- **SOA**：Start of Authority 的缩写。它定义了权威名称服务器，在本例中是ns1.h1ya.local。
- **NS**：这是名称服务器的缩写。
- **A**：A 记录。它指向 IP 地址的域名/子域名。
- **Serial**：这是 DNS 服务器用来确保更新特定区域文件内容的属性。
- **Refresh**：定义从 DNS 服务器从主 DNS 服务器传输区域的次数。
- **Retry**：定义主 DNS 服务器未响应时，从 DNS 服务器应重试的次数。
- **Expire**：指定当主 DNS 服务器不可用时，从 DNS 服务器在响应客户端查询之前应等待的时间。
- **Minimum TTL**：负责设置区域的最小 TTL。
- **MX**：Mail exchanger的缩写。它指定接收和发送电子邮件的邮件服务器。
- **CNAME**：Canonical Name的缩写。它将一个域名的别名映射到另一个域名。
- **PTR**：Pointer 的缩写，该属性将 IP 地址解析为域名，域名解析为 IP 地址。

然后更改两个文件的权限：

```
chown named:named /var/named/192.168.2.db
chown named:named /var/named/h1ya.local.db
```

### 6. 验证 DNS 配置文件

配置完成后，需要验证配置文件是否正确。

首先验证主配置文件是否有语法错误：

```
named-checkconf /etc/named.conf
```

验证正向域文件：

```
named-checkzone h1ya.local /var/named/h1ya.local.db
```

验证反向域文件：

```
named-checkzone 2.168.192.in-addr.arpa /var/named/192.168.2.db
```

如果所有验证都没有错误的话，则重启 BIND 服务：

```
systemctl restart named
```

### 7. 配置防火墙（如果禁用了防火墙，可跳过）

在防火墙上打开 53 端口，以允许客户端的 DNS 查询请求：

```
firewall-cmd --permanent --add-port=53/udp
firewall-cmd --reload
```

### 8. 验证 DNS 服务


到此，BIND DNS 服务就配置完成了，现在可以到另外一台 DNS 客户端测试服务器上添加 DNS Server 地址，看是否可以正常解析。


在客户端上编辑 **/etc/resolv.conf** 文件：

添加 DNS Server 地址：


```title=/etc/resolv.conf
nameserver 192.168.1.100
```

然后解析域名：

```
dig www.h1ya.local
dig ns1.h1ya.local
dig mail.h1ya.local
```

如果一切正常的话，应该可以看到解析成功的结果。

然后再测试反向解析：

```
dig -x 192.168.2.33
dig -x 192.168.2.34
```

通过浏览器或 SSH 登录都可以验证域名到 IP 地址的解析。

### 9. 从 DNS 服务器

未验证，待补充。

### 10. DNS 转发

DNS 转发主要分两种：
1. **全局转发** 凡是本地没有通过 zone 定义的区域查询请求，全部转发给指定的地址。
2. **局部转发** 仅转发对某特定区域的解析请求。

### 11. DNS 加密

未验证，待补充。


参考链接：

[How to Setup DNS Server (Bind) on CentOS 8 / RHEL8](https://www.linuxtechi.com/setup-bind-server-centos-8-rhel-8/)

[Set Up BIND Authoritative DNS Server on CentOS 8/RHEL 8](https://www.linuxbabe.com/redhat/bind-authoritative-dns-server-centos-8-rhel-8)