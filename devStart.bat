@ECHO OFF
REM **************************************************************************
REM  此文件方便本地开发启动使用， 按照自己的实际情况修改配置
REM  注意：修改前将此文件拷贝到其他目录（即非svn目录）下修改后运行。不要把修改过的文件提交到服务器
REM
REM **************************************************************************
REM
REM 设置示例如下：
REM set PROJECT_ROOT_PATH=D:\work\projects\iscloud\iscloud-web 项目所在的绝对路径
REM set API_SERVER=http://localhost:8091/platform/    API服务地址
REM set APP_ADDRESS=localhost   	  前端服务的绑定地址
REM set APP_PORT=8080     			  前端服务的访问端口
REM set APP_MARKET=http://192.168.38.72:8080/    应用市场的地址
REM set MULTIPLE_PAGES=false 		  多页面模式
REM set APP_NAME=resourceCatalog      前端程序将要运行的项目模块名称（单页面入口）
REM
REM **************************************************************************
REM ==================================================================================
REM
REM 设置项目所在根目录
set PROJECT_ROOT_PATH=

REM 设置前端需要运行的模块入口名称
set APP_NAME=appMarket

REM 设置前端启动地址和端口
set APP_ADDRESS=localhost
set APP_PORT=8080

REM 设置API服务器地址和端口以及上下文
set API_SERVER=http://192.168.182.142:9001/platform/priviapi/

REM 设置应用市场地址
set APP_MARKET=http://192.168.38.72:8080/

set PLATFORM_LOGIN_URL=

REM 设置多页面模式
set MULTIPLE_PAGES=false
REM
REM =====================================================================================
IF NOT EXIST "%PROJECT_ROOT_PATH%" goto NO_PRJECT_PATH
IF NOT EXIST "%PROJECT_ROOT_PATH%\src\%APP_NAME%" goto NO_APP_NAME
for %%a in (%PROJECT_ROOT_PATH%) do set APP_DISK=%%~da
%APP_DISK%
cd  %PROJECT_ROOT_PATH%
npm run dev --app=%APP_NAME% --appaddress=%APP_ADDRESS% --appport=%APP_PORT% --appmarket=%APP_MARKET% --apiserver=%API_SERVER% --multiplepages=%MULTIPLE_PAGES% --platformLoginUrl=%PLATFORM_LOGIN_URL% --hot --inline 
goto end

:NO_PRJECT_PATH
echo 项目文件路径错误: %PROJECT_ROOT_PATH%
goto end

:NO_APP_NAME
echo APP NAME '%APP_NAME%'不存在

:end
pause


