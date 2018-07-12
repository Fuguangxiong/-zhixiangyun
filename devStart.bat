@ECHO OFF
REM **************************************************************************
REM  ���ļ����㱾�ؿ�������ʹ�ã� �����Լ���ʵ������޸�����
REM  ע�⣺�޸�ǰ�����ļ�����������Ŀ¼������svnĿ¼�����޸ĺ����С���Ҫ���޸Ĺ����ļ��ύ��������
REM
REM **************************************************************************
REM
REM ����ʾ�����£�
REM set PROJECT_ROOT_PATH=D:\work\projects\iscloud\iscloud-web ��Ŀ���ڵľ���·��
REM set API_SERVER=http://localhost:8091/platform/    API�����ַ
REM set APP_ADDRESS=localhost   	  ǰ�˷���İ󶨵�ַ
REM set APP_PORT=8080     			  ǰ�˷���ķ��ʶ˿�
REM set APP_MARKET=http://192.168.38.72:8080/    Ӧ���г��ĵ�ַ
REM set MULTIPLE_PAGES=false 		  ��ҳ��ģʽ
REM set APP_NAME=resourceCatalog      ǰ�˳���Ҫ���е���Ŀģ�����ƣ���ҳ����ڣ�
REM
REM **************************************************************************
REM ==================================================================================
REM
REM ������Ŀ���ڸ�Ŀ¼
set PROJECT_ROOT_PATH=

REM ����ǰ����Ҫ���е�ģ���������
set APP_NAME=appMarket

REM ����ǰ��������ַ�Ͷ˿�
set APP_ADDRESS=localhost
set APP_PORT=8080

REM ����API��������ַ�Ͷ˿��Լ�������
set API_SERVER=http://192.168.182.142:9001/platform/priviapi/

REM ����Ӧ���г���ַ
set APP_MARKET=http://192.168.38.72:8080/

set PLATFORM_LOGIN_URL=

REM ���ö�ҳ��ģʽ
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
echo ��Ŀ�ļ�·������: %PROJECT_ROOT_PATH%
goto end

:NO_APP_NAME
echo APP NAME '%APP_NAME%'������

:end
pause


