/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const config = require('bedrock').config;
const constants = config.constants;
const helpers = require('./helpers');

const mock = {};
module.exports = mock;

mock.equihashParameterN = 64,
mock.equihashParameterK = 3,


mock.didDescriptions = {}
mock.events = {};
mock.keys = {};

mock.keys.alpha = {
  publicKeyPem: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvHR97zikg8vlgl5srpmZ
K0SQYPc4QQS/D1yNihWKKc81N+pi/CJrbQF0zi0LSjw/eVR+q38nwQRwdTQk+eI6
IKXt9dl2UxiMoYcZyW6STgJqLprQbHVW87/ek9ffYxe39vyc25bVVZbIxhCwXf9+
TeIeGChMRpXI05O3i9rSDA/XMSY0qkx+fJ621elsk5UBBb8TLruUHpfGwfuRgN6S
FgWMNMqPbki7CJRf/+3hpTTk50wndkwk69PWUwueDwR4B5htSOunPKyO4Hl5cn+R
1lNMhAKdshDnSP0A83GZqJ5weXP+1o/g3b70H6r9rG4bx8hWc745iJsdgQ9yUYYL
vwIDAQAB
-----END PUBLIC KEY-----`,
  privateKeyPem: `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAvHR97zikg8vlgl5srpmZK0SQYPc4QQS/D1yNihWKKc81N+pi
/CJrbQF0zi0LSjw/eVR+q38nwQRwdTQk+eI6IKXt9dl2UxiMoYcZyW6STgJqLprQ
bHVW87/ek9ffYxe39vyc25bVVZbIxhCwXf9+TeIeGChMRpXI05O3i9rSDA/XMSY0
qkx+fJ621elsk5UBBb8TLruUHpfGwfuRgN6SFgWMNMqPbki7CJRf/+3hpTTk50wn
dkwk69PWUwueDwR4B5htSOunPKyO4Hl5cn+R1lNMhAKdshDnSP0A83GZqJ5weXP+
1o/g3b70H6r9rG4bx8hWc745iJsdgQ9yUYYLvwIDAQABAoIBAAZwOGk21zAFhEbK
8Q2aA8idpA0cBRj7j4d30wIXsEuzX48Ue+M/TcpAlXwBv/P+UPDVOSqkwnfureTj
Liw3VWMOKC4RCuDV4uAV3ISsOWVe4b/L3DkIXTsgn/sPEfuxsMBIaxd5dLpi12Mk
6NGdS/RfOEX9AnYa4eyQjGHDzQ9KYD5KX+h8yNOGOAJeLUlZnlWm8Bu8+Pfu12RR
Vlcg8KQDkaQ6EU7F8Ad9Ob1FXj5ANkI0d6PXLEY/KpouN0PCtJWpKNBfYlZXdybJ
0Z4MjKEi4USEQ+A8mV+PcaMj/BKQOoZ2H6pKrTj+M0nB4vPO4bIlQXLpHOgPavRd
s91Q4KECgYEA3onilj1bXK9WmZqPhBfbowro++dz4DFlxDscV0FXi8Rn3xwlH85h
eUW9xfBtxv+ITH7z7Bwu1+esu2iEfBdHNnVr3ZOpmA6zAaOJnPg3RCkpRDD6VZfi
nK0Mi4Rj1CqnkuP7x2irCUNyrqD+oaBpWURhhO+WqKzosToxcw/8XtECgYEA2Mqj
S8ad+S1RxZUy2C/t/4G49mLwueIDGDuOFmhQSKOvjVWBs6xWh3Usq9cevqZO5TG5
F8IRZYz2pMQ+727+9daTo4qzvkKxPAeoz80oU23gskw5vpyy93fUbHLewTLsyzYJ
3fhuVJxOwTZHNGgxaGmucIomcYKXcBMcoJVDBY8CgYEA0XgIiFKIxN1mLn+Fx1iN
rRJ/610ZfVYB7IuXSap/tVfSTfg4GZAxv+0djEubiUzOBvMYto5wqVmxBVaEHinr
Jh+wwIhVgoOTi19cERyzKL110nInsJme/MsGm+yp6vObeHCQdkrXc4jBUg7In2pW
v2fWQ0MiFPNstCWKljvd2YECgYBxcE9UVmDRQzKXtgN99k6ONV4IpysZyTcfVgJ6
nSjtaaFxzj1pPBOnG9w9Kvqufi2oZoVY9jbOMZ3aB8p61VTaZOaqW+jD9Pfy1nsy
CUNBrKw4AATzReGr9msUOGNxKumXR/aPzPBGm+fl2DYYKTE5VpttzgxhtxjxDz8a
lCAW5wKBgD7/jyvV600KJLBRQqCGS42oBhUIeswL8+HbYF1SxPqJtRn7106IC0df
eDlJtPHeXG02xjPRrdkywqmUq5PMpIbfKCzoFaTM8/j0WLdEBUPv/D5ewuTFXzbK
KfbI1DcPUFVoPKZQFgGQn2p/GUrBv+jDj3k1FRWtbEb3PPSwau6p
-----END RSA PRIVATE KEY-----`
};
mock.keys.beta = {
  publicKeyPem: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtfbDBWjIj8eJFwq+SR75
TZRwZSCa4f5DQUzox5yIJMAS1oNgrf1uzJcKL3MF2TuLGB+/2dj5DuCUJ/Zit8S7
7kW825vmBUWXdmgZXyXCBCmkh9AUHxFESe+dnzPtp2w0pKvOuOw8vw4f8tlcDVkZ
tPuqeJcMb/e+CjZdKNK6BMJ/41NWXMh5w4YLgRAqZvCX/4rfOdzkregR6tGqNHxg
AcJIf2qZaxOjJqa2HgMUpFOsCR5jneqrO0Ll5eyOnEbfmMcvVIQCOqAK8mmokJwD
UEr6cBlzVn5Zl+EF0SARgGN7l/qF+t/xeRUSM381Lkpjn6S5sBJfCS9F6gMasmak
lwIDAQAB
-----END PUBLIC KEY-----`,
  privateKeyPem: `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAtfbDBWjIj8eJFwq+SR75TZRwZSCa4f5DQUzox5yIJMAS1oNg
rf1uzJcKL3MF2TuLGB+/2dj5DuCUJ/Zit8S77kW825vmBUWXdmgZXyXCBCmkh9AU
HxFESe+dnzPtp2w0pKvOuOw8vw4f8tlcDVkZtPuqeJcMb/e+CjZdKNK6BMJ/41NW
XMh5w4YLgRAqZvCX/4rfOdzkregR6tGqNHxgAcJIf2qZaxOjJqa2HgMUpFOsCR5j
neqrO0Ll5eyOnEbfmMcvVIQCOqAK8mmokJwDUEr6cBlzVn5Zl+EF0SARgGN7l/qF
+t/xeRUSM381Lkpjn6S5sBJfCS9F6gMasmaklwIDAQABAoIBAEOboa461noFazwy
c6z7YymeA3yvdpyNOjPi/YJc+ICfFOC7A4rh5O8DF3e1xvCFnRKjiUbJxQ/wBVwr
wVYCNMk9BASckgRXbQVDfFnLz6B4UHddqnw4kCTgcLIcOyq/m3erli1DKPbbqqcy
d29GMbT65MXVaXuYkvV8aXSnhxIJCSPWM8D6F+jy8x9sJ3zVKuTsugiJGLD+BITJ
QnwCFneHe/ZFpbiJ9sE52dLXZuwAjp2CNVNJTkcwXvDByBMSOdKL84+/CbP5lMhV
RmfFWLLVZOmwGBaLfBD2PA6O9zZyC0oRp+uK++ymC8SKFP9JWxo72Vh1RWqMLfy6
FYnplDECgYEA7NSBsTwzYc0jzLP6TdQOFl8iYq3eHfeqdYUdQzvJhzRwEHrY7IOJ
Vi5MzCwq+r6At78AIEIlxYphcI7EHc5B3hZwt6S4WzJqswp1kGQeInLwrwJ+jrN1
GVYvZjrcKn9wOQm1LYlmXb7wyWqzd6O+/ODTt+XNGKKR8zuOzjdDRqUCgYEAxLFX
VkkqX7HOgtGM9+CHjDkbpRgVjmbF+WPQiyqGn2yZUL9v+D27Ymejn1Wv4SyK04Ia
iFo03nPaunxDMuoLg8hLw4h9heeE9qiUFCrwN3NgkDHxFXmjmf5tIPS01tHAzHf4
/2dUniOiCmRaWSqYlLwtl4n8SuxpYaSXjsc41YsCgYEAlAF2j8n8nolybxKnQg5d
Q3Pu7FaWcon+GHW5RPRPTNTjmBj+CklmAdrrmcmcjpmRncObE43jRyHlJU/DlpD5
Lw89IDesEypd7kiCElvPTV4htm3Lo+jZLJ1k//GW+GQuQSck+DFfLQUQPAAX6pQF
3smu5sWRuGyY47Z717pHrBUCgYBljNn2ppfGCFsCl4YchEP3VZS8TA71EoKsG6iT
8UTIEp2lXvFETTrtt2x22xqPOxwBz247b7dUEqSfG4DmTIfdZhAXx+Rmuf2gC7FI
KFMVjfARAnfiCoc4/m8BUNX9AxZzeo2H76V0cBk9HEq5NpDIWc+AKbGkTSKrUvsc
sCbbuQKBgAGJhUtJE2MzwsDJAyUerrGwg9qoLcYe+8Jciqcs3HtYS6FqE3qVSAj9
HjjvHqBAXQSbGFBMhsU5XSUUn3dImVGGHAD6vsBne5MmtzPp9ztEdO7y4vhPRLv0
d5xsrhs54+2xLXS8FWstYFgN0Lqrxag9FvAMwdb3Uy6UHjAysK54
-----END RSA PRIVATE KEY-----`
};
mock.keys.gamma = {
  publicKeyPem: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzsr2+5KX7Tyl82nB4h1H
WY0af7heqntZS+HHzvaEq0S3EkPa1wh9bPL/KO6aU+5S7k/m8NGpOZGYq/zEmSQ+
L6glVcqH1cB53yLZYwvNSa4YMxdZY4AQ3oudhtLVfdR+0fbbF9C06p167053P8aZ
y8zMKhHUEU9gpAZJfqXxVnRQMfQcbK81ds7eFzpvlk+yPdxnhO9uNl3yaOn2MR3m
MjojQu5vLjksW1G5rEj8vWTdo421ugbLgEMMqJ6apRq/KugSQvKQpBqppl7avMbt
XRreg0Qkpl9gG6kzCVnvfbYJQhsrfgcRezmnUHZw79QvW4CImey8u7nRs3tbhbno
jQIDAQAB
-----END PUBLIC KEY-----`,
  privateKeyPem: `-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEAzsr2+5KX7Tyl82nB4h1HWY0af7heqntZS+HHzvaEq0S3EkPa
1wh9bPL/KO6aU+5S7k/m8NGpOZGYq/zEmSQ+L6glVcqH1cB53yLZYwvNSa4YMxdZ
Y4AQ3oudhtLVfdR+0fbbF9C06p167053P8aZy8zMKhHUEU9gpAZJfqXxVnRQMfQc
bK81ds7eFzpvlk+yPdxnhO9uNl3yaOn2MR3mMjojQu5vLjksW1G5rEj8vWTdo421
ugbLgEMMqJ6apRq/KugSQvKQpBqppl7avMbtXRreg0Qkpl9gG6kzCVnvfbYJQhsr
fgcRezmnUHZw79QvW4CImey8u7nRs3tbhbnojQIDAQABAoIBAHyn2O6Z1b+Kubbb
36ZAZAxVhM3NBDPcm12kwt+9twfPKlR2VusdEQ6mBK5V9u31UkSaIeq1WD99xvyW
KKTwNhRgVfE7X1q45j5eMZEFQkDSE4Bo6NeUEZc1rkXhvhRWDgTfu/7FLunm+H5d
XIEzZO53i/MoQCAXK3h02cTgn3SvHthEITPCP7IK1m+Akj5khmjVNfeUCK+n29na
exxaUK0URWGYXxN/xEs2w6us00t1UkcEFgwWVsHeyR+RUwPUgM0k3HM8txgi4SGe
ro2y4MT9UgXH4BmasZRtzCNO3GlIBoUlDaugzztP42awgIWjyJDy2PC/b6tayqOj
GGT/vMECgYEA9V2wbxlTw6vce22iMlM2TnGs+5UoNjrEXWP3vK02ifrjcC1nU6pF
3tgYQmmQeby/s+UN5DZOZS7byLeqciuFEis8gR4/5Fk6LZ9Pe9+dYNGx5W1tcSRi
bCBWIGQ4wc7i/lOQq4NuM3BFCJFn1DqWigP6EpPxn1uVuGoIoVFlAXUCgYEA18FP
eWHm5fOtRC2gDk0z+opJKwcN8KPEHsYMg64k8JLohetONV8gG2cU0nHab1PK+3LZ
XZKfMynM55k5ZmCttmxHE8sFDtXSY4EAnvLtCRQgBviqj12UAf9LWE+mzGdfbWUM
8Abx6QuLYTvw2RaEWscnbPeHK99rMpurIRtOD7kCgYAfRPFXN0MVjLFsiWxCPZiO
Jq6E4V1ei966iCLqSKjKrM6PXTntz6VX4PI2hH2FBijoJCjBDKqw+mfIDKAMLL+o
sRnk2pYJ49UmO0dF4hmMXSzusCNiZ+CjJvvS5PLWwCbtgnjNYtKIe6ZQkTdKNK06
qYcVFwWT6XgLKHgxFs5ogQKBgB1h0Q3pvEUimz0GrZ5k+ygqfu5iJo7X7pR2SiwA
oj009H+QXPU9wCSbNCW4pZO1qJX3vQxWNGIGVkZQApYjomSOeFuEsWqkyeMNJWWA
FbG/0ODCKpAdoVNoTf1303JQvZkrQsjJWVZwYQnb3N/jhiDKsF7RktHxuiqJMpPu
oQHZAoGAbwtpQhNEAJaeDcA2RkKAxn0/5BPEGM89gTApyXgjm94VD7IC2TPIc/N8
oiZyrhyyiV/k/HcrMPjemDMxUooZVnvX3jwTlQ0wvGcwc28U1NXG3k73mZcXhYkM
bgcCk57VPuJ8neDWgV6m5CAGbABcqJY9wcAwsVyhVudLhgMq9qg=
-----END RSA PRIVATE KEY-----`
};
mock.keys.delta = {
  publicKeyPem: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxGZt+B9GLHcZ8Om7/CYz
7Yox1C7NlBLWQiaRPe4noSJ0Ml0wZu5ZPqLt4fj2TPNzqu2s7T56p6EuFG8xKDYB
gKT3WQz0fCQfM6W5dxfr5lJIz/lWWaTzWTmcvYzgTwLi7hI1HipboAg8tCSutRvV
7rXTwHLzUT3tue3Ox6sBqUOlbJ+ULOhditSNM1lnjMG53YCnPUft1kbVkmNjpdZF
IT7tZ1IGjrbQJ48+Eoh0oDsXnCHiGZ56z4s8dULauMhakRUovWXBD3UHneUI0RTm
VP+cbAx9eWNvoF3TPdXAaZk5PG8m7Qgo9em+V7vfDfFXfprpccNBOgnGbXBdi0/0
1QIDAQAB
-----END PUBLIC KEY-----`,
  privateKeyPem: `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAxGZt+B9GLHcZ8Om7/CYz7Yox1C7NlBLWQiaRPe4noSJ0Ml0w
Zu5ZPqLt4fj2TPNzqu2s7T56p6EuFG8xKDYBgKT3WQz0fCQfM6W5dxfr5lJIz/lW
WaTzWTmcvYzgTwLi7hI1HipboAg8tCSutRvV7rXTwHLzUT3tue3Ox6sBqUOlbJ+U
LOhditSNM1lnjMG53YCnPUft1kbVkmNjpdZFIT7tZ1IGjrbQJ48+Eoh0oDsXnCHi
GZ56z4s8dULauMhakRUovWXBD3UHneUI0RTmVP+cbAx9eWNvoF3TPdXAaZk5PG8m
7Qgo9em+V7vfDfFXfprpccNBOgnGbXBdi0/01QIDAQABAoIBAGbSlYpMnUmURUGK
rT9ypMcdDb9fjYOTZRcW5/17XMYQqrLfdQK+kHypgk9HL3PUFV+MtXczubVfPie2
mw7JT3oRY+n8TVdc9fTtM681F+zqcXJowJuIL1ssPXJDegADq9kmMScM2BFtnpJV
jh4FZ7hk+2qLA/YprPclmJeSYPlDJWO6UjhO0vC/S14qdH/8zd4qK2Ps6mZreXhr
iEozLj8sEh41M6k7bff2s84fsdll/Spv+3WZa3/YI1t14WDe6/iwvAy2H+KgjIK9
OndaPJOx+cqcPs2NKNn9MEo3ek9viEUX4FV1VQZQOgRzhS8vaNLLm14LhPZjVcuA
DJ28soECgYEA4ERwBhhsbQOArAtKY8XwbVq6n4XjWKESL/e2p6tGKzzD4bfjaR7O
cL1KziO7U3a7CkQapznJLnvrKfuSMOlytaMoqKwWCGB6fepemCMacFju2XfP0zgy
15wosklMWIiy9a3f34j7v4NkLCoH7N3+wcobkaCrfkcBMpC9LVlooXUCgYEA4DCR
GkcusyJHg/h3F9BjUog/8QD+uHlougTLe+HEFGnS/uUPgESpgOIJURMiKDwOrO9a
vlnDsk+0EvSzVeseIH05or5ou/fg4qiYtBv5Gn0nh4WBbI9O+QDEg+rFlWZUIbkp
bkiKqoa5hzDNgNT/wPDkcMq4yc6NvFFZVSTrOeECgYB4dSn6jCnI0AXP4uyc9Jd0
FTSCNIbtdu5u502rd3pkBOptlbjHIK3frjy8xkJ6zR4foH70bTxbBGJGlYJrVSiw
2ScgmfXnn/KLKVSPwOMVjx8TnZ/6IohkeNL/GBGyyBHflfnWdhxKPIeUlSrWllKc
wjLWoIccd4T0JPwHnKtvdQKBgQCsHV0o+YEm0ahp7vUveTLnh+bfFc54vezi8w9t
ejRZH613N1AhP5WKdv6EGdZdYU47Aj9+Z9fQK1SqQOb1jV5BvyHiiaBKvtEN8jXa
AKfL6E3Sw3JLb/JHRImaZUFvo3HvugHOwy6CIJCK87Kxt9TpwYb/+QLJHCTAcQvO
TFuywQKBgB78IUhPFz5BY6x/zvPSTQzHDBBOyaZzxWv0NTb5EqySApx2IVdIwMyi
elJwHAbGdGLRQts4YPo/siXcGUbwrEfEl9jwNr9MOxoIZNClNwSPVMjgxUcTNZ8Z
qIKQx44BsvbLIsH629MdTcnSrb0LFqUaBOsSu5A8gDIgdi8GE2qj
-----END RSA PRIVATE KEY-----`
};
mock.keys.epsilon = {
  publicKeyPem: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqEi961jaGEKTBMhogM1G
Hfa0Oj1awkB5f6xDewyT65ur7V8U3hq+HY90XWVJb8Zg2s7TaECbLebwNylY7+zz
n0P1HfQSSPeeypPw3kETB/+mReOu9Pp8hKmGzV1g2ILBYp3Oihw1P3leO84V2XD6
XvJx6HEeoCZ1ux6gbQ/rFw6MsyWzVZyC2BLqSXO9HipoqBqQQLToDW1fSWloeAhH
9pmE+aSC1cTeDJteio0Pp0LAn0+vOJWUDQjNK162ad801/dLSwaGiXqN6z//R967
TNw+5nqhc2zC9WXWlkiKMNWBqtC8uxSV5PLO/e0saHP9L8LdZnGxxtsPwC7TIDBo
TQIDAQAB
-----END PUBLIC KEY-----`,
  privateKeyPem: `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAqEi961jaGEKTBMhogM1GHfa0Oj1awkB5f6xDewyT65ur7V8U
3hq+HY90XWVJb8Zg2s7TaECbLebwNylY7+zzn0P1HfQSSPeeypPw3kETB/+mReOu
9Pp8hKmGzV1g2ILBYp3Oihw1P3leO84V2XD6XvJx6HEeoCZ1ux6gbQ/rFw6MsyWz
VZyC2BLqSXO9HipoqBqQQLToDW1fSWloeAhH9pmE+aSC1cTeDJteio0Pp0LAn0+v
OJWUDQjNK162ad801/dLSwaGiXqN6z//R967TNw+5nqhc2zC9WXWlkiKMNWBqtC8
uxSV5PLO/e0saHP9L8LdZnGxxtsPwC7TIDBoTQIDAQABAoIBAA8wOYvzQgPshk5p
NB1j6Y8sxAl5niZoIU8nohOKCBO8wiCzczO0oDIUz4Dacm1XL0iwYB5JrnfPHyEr
Zy6IaViXjpj8fWX+i2NnRNcacnhHV595NEJCFVj34AXLBsGj04ZuDcUjVJ78+kdV
i11LuB03rpY3F3eG4RtZYUtWo3Y6IXtDejkmZedE1IxxmWb6AIQoYO2jqepvHKxb
eFMmOWSWB9iiWNbHaD/4b3Xymc6KDuu0B/V1W9nWqStJyjVX1us/NAVbfN7jHZ1E
pELvaGWF5jIDcibirB5svpZMFgoqRD4f7qTkc9AJ7mskefr4sZagt8/5QfhelsBj
MSAAYSECgYEA0DA9FkPagzJP3GV81tThgLGp05y05JJQ8l4vAtJDf/fdFrnKDb2c
xfvcukxQbN/nhBtm4Tl1cWiRSLkCp9/NIJGyIZ0aS6XF9DZp1zPBKKgqcV4BLYGG
CmbaG+VD69/4cnatCkg8skBV9qa5FY1LXaILrvbxR9DFUIUEFfazILkCgYEAzu51
8b2jZcJLeuaC9atAtHPpvlPoJHS0VTl4xunpHN/9M6nAKoSP1Z1UwrINCeiOzlXR
iOadi/oYbmtksPZw7+ps1rsk9cFim1WcI4JdDMgr0h/h92oj4AYXLR8Xu8dOm6Ey
bBVPvmawu+cR76sh2O29ey8ZJpc8FnDhLzIqsjUCgYEAytbFHeVciElD0Bu9h18A
my/+pCPhh3Ybkhk7uob8pzjrW1IHUF322ltrksP59CovWuKL2VLvX2CfdPh1YvTF
2j66DNARp7TLawZ9FuThBOjb+Xq6sQiqfYX6agV1qOKeIYAJVqRNJutSFjAY0qvI
y2Cv+3e0W+FH7gy7j16+5lkCgYBYm7W3eSvhpAwsKU7EobtISiY6ELXj/nFF2SFF
k931Nli26aZWzoLExuUHpbR9nK6h3g+mXpHx4XratXPdbvm3Uhue624NKezudP8y
GV183q4dAPgCuNl50UHVWW4RQ2v+qkzsCUgnUNO28mA0z4Pj3xF3ERjk9HePaHCU
hBfSTQKBgGG51eyiQLZvaIcuo7ad9nE/soHxfFvvrPXtqiD0YGsxu0Ur/bnU3IJV
/3l1DI9L5vC3RMSKJoBZ8k7b23uvLDoFxeSLL1Bjo3Fwn2jlyBPdbjxqgPj1l8rX
Xl6keXhu4LsakYCCLQqLykebgHd7oUzNcwF+qxkowSXbTlFiCM1O
-----END RSA PRIVATE KEY-----`
};

mock.didDescriptions.beta = helpers.generateDid({
  publicKeyPem: mock.keys.beta.publicKeyPem
});
mock.didDescriptions.gamma = helpers.generateDid({
  publicKeyPem: mock.keys.gamma.publicKeyPem
});
mock.didDescriptions.delta = helpers.generateDid({
  publicKeyPem: mock.keys.delta.publicKeyPem
});
mock.didDescriptions.epsilon = helpers.generateDid({
  publicKeyPem: mock.keys.epsilon.publicKeyPem
});
mock.didDescriptions.alpha = helpers.generateDid({
  publicKeyPem: mock.keys.alpha.publicKeyPem,
  authorization: [{
    // anyone may update the authenticationCredential and authorization
    // fields as long as they provide a specific multi-signature proof
    capability: 'UpdateDidDescription',
    field: ['authenticationCredential', 'authorization'],
    permittedProofType: [{
      proofType: 'RsaSignature2015',
      minimumSignaturesRequired: 3,
      authenticationCredential: [
        mock.didDescriptions.beta.authenticationCredential[0],
        mock.didDescriptions.gamma.authenticationCredential[0],
        mock.didDescriptions.delta.authenticationCredential[0]
      ]
    }]
  }]
});

mock.events.create = {
  '@context': 'https://w3id.org/webledger/v1',
  type: 'WebLedgerEvent',
  operation: 'Create',
  input: []
};
