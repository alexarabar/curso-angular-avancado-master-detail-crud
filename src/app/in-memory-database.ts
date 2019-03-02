import { InMemoryDbService } from "angular-in-memory-web-api";
import { Category } from "./pages/categories/shared/category.model";
import { Entry } from "./pages/entries/shared/entry.model";

export class InMemoryDatabase implements InMemoryDbService {
    createDb() {
        const categories = [
            { id: 1, name: "Moradia", description: "Pagamentos de contas da casa" },
            { id: 2, name: "Saúde", description: "Plano de saúde, remédios" },
            { id: 3, name: "Lazer", description: "Cinemas, parques, praia, etc" },
            { id: 4, name: "Salário", description: "Recebimento de salário" },
            { id: 5, name: "Freelas", description: "Trabalhos como freelancer" },
        ];

        const entries: Entry[] = [
            { id : 1, name: "Gás", categoryId:categories[0].id, category: categories[0], paid: true, date: "14/12/2017", amount: "70,80", type: "expense", description: "Qualquer descrição de despesa..."} as Entry,
            { id : 2, name: "Suplementos", categoryId:categories[2].id, category: categories[2], paid: false, date: "14/12/2017", amount: "20,00", type: "expense", description: ""} as Entry,
            { id : 3, name: "Salário", categoryId:categories[3].id, category: categories[3], paid: true, date: "15/12/2017", amount: "3140,00", type: "revenue", description: ""} as Entry,
            { id : 4, name: "Aluguel",categoryId:categories[0].id, category: categories[0], paid: false, date: "14/12/2017", amount: "70,80", type: "expense", description: ""} as Entry
        ];

        return { categories, entries }
    }
}