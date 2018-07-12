import Util from './Util'
import UtilService from './UtilService'
export default {
	newApi (api){
		let token = UtilService.getQuery('tokenId') || UtilService.getQuery('token') || Util.getToken()
		return api + token
	}
}