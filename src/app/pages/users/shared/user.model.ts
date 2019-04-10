export class User {
    constructor(
        public _id?: number,
        public name?: string,
        public email?: string,
        public cpf?: string,
        public telephone?: string,
        public street?: string
    ) {
        this._id = _id;
        this.name = name;
        this.email = email;
        this.cpf = cpf;
        this.telephone = telephone;
        this.street = street;
    }
}
