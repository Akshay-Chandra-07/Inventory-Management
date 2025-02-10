class UserService{
    static async cleanUserData(data){
        return data.reduce((features,user,i,arr)=>{
            let existingUser = features.find(feature => feature.user_id === user.user_id);
            if (!existingUser) {
                features.push({
                    feature_ids: [user.feature_id],
                    user_id: user.user_id,
                    username: user.username,
                    role: user.role
                });
            } else {
                existingUser.feature_ids.push(user.feature_id);
            }
            return features;
        },[])
    }
}   

module.exports = UserService