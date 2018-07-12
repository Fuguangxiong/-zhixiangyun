// 帐号管理 start
import safetyManagement from '../../personalConsole/component/accountManagement/safetyManagement/safetyManagement.vue'
import modifyPassword from '../../personalConsole/component/accountManagement/safetyManagement/modifyPassword.vue'
import modifyPhoneNumber from '../../personalConsole/component/accountManagement/safetyManagement/modifyPhoneNumber.vue'
import modifyEmail from '../../personalConsole/component/accountManagement/safetyManagement/modifyEmail.vue'
import basicInformation from '../../personalConsole/component/accountManagement/basicInformation/basicInformation.vue'
import realNameCertification from '../../personalConsole/component/accountManagement/realNameCertification/realNameCertification.vue'
import ReApplyrealNameCertification from '../../personalConsole/component/accountManagement/realNameCertification/ReApplyrealNameCertification.vue'
// 帐号管理 end

export default [
  { // 帐号管理 start
    path: '/safetyManagement',
    name: 'safetyManagement',
    component: safetyManagement
  },
  {
    path: '/basicInformation',
    name: 'basicInformation',
    component: basicInformation
  },
  {
    path: '/realNameCertification',
    name: 'realNameCertification',
    component: realNameCertification
  },
  {
    path: '/ReApplyrealNameCertification',
    name: 'ReApplyrealNameCertification',
    component: ReApplyrealNameCertification
  },
  {
    path: '/modifyPhoneNumber',
    name: 'modifyPhoneNumber',
    component: modifyPhoneNumber
  },
  {
    path: '/modifyPassword',
    name: 'modifyPassword',
    component: modifyPassword
  },
  { // 帐号管理 end
    path: '/modifyEmail',
    name: 'modifyEmail',
    component: modifyEmail
  }
]
