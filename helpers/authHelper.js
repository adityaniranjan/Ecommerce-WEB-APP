import bcrypt, { hash } from 'bcrypt';

export const hashPassword = async(password)=>{
    try {
        const saltRounds = 5;
        const hashesdPassword = await bcrypt.hash(password,saltRounds);
        return hashesdPassword;
    } catch (error) {
        console.log(error);
    }
}

export const comparePassword = async(password,hashPassword)=>{
    return bcrypt.compare(password,hashPassword);
};