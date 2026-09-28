console.log("Inicio de programa");

console.log(process.argv)
const args = process.argv.slice(2);

// --- PRODUCTOS DE PRUEBA (Por si la API está caída) ---
const localMockProducts = [
    { id: 1, title: "Zapatillas Locales", price: 99.99, category: "calzado" },
    { id: 2, title: "Remera de Prueba", price: 29.99, category: "ropa" }
];

async function getProducts(url) {
    try{
        const response = await fetch(`https://fakestoreapi.com/${url}`)
        if (!response.ok) {
            throw new Error(`Código de error del servidor: ${response.status}`);
        }
        const data = await response.json()
        return data
    } catch (error){
        console.log("\n⚠️  La API externa falló o está caída. Usando datos de prueba locales...\n");
            // Si lo que se pidió fue la lista de productos, devolvemos el Mock local
            if (url === "products") return localMockProducts;
            
            // Para GET individual (GET /products/1), intentamos devolver el primer producto de prueba
            if (url.startsWith("products/")) {
                return localMockProducts[0];
            }
            return null;
        }
}

async function updateProduct(url, updatedData) {
    try {
        const response = await fetch(`https://fakestoreapi.com/${url}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData)
        });
        
         if (!response.ok) throw new Error();
                const data = await response.json();
                return data;
            } catch (error) {
                console.log("\n⚠️  La API está caída. Simulando actualización local...");
                return { id: url.split('/')[1], ...updatedData };
            }
}

async function deleteProducts(product){
    try{
        const response = await fetch(`https://fakestoreapi.com/${product}`,{
            method: "DELETE"
        })
        if (!response.ok) throw new Error();
            const data = await response.json();
            return data;
        } catch (error) {
            console.log("\n⚠️ La API está caída. Simulando eliminación local...\n");
            return { message: `Producto ${product} eliminado de forma simulada.` };
        }
}

async function createProduct(product){
    try{
        const response = await fetch("https://fakestoreapi.com/products",{
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(product)
        })
        if (!response.ok) throw new Error();
            const data = await response.json();
            console.log(data);
            console.log("Created product ID:", data.id);
        } catch (error) {
            console.log("\n⚠️ La API está caída. Simulando creación local...\n");
            console.log({ id: 21, ...product });
            console.log("Created product ID (Simulado): 21");
        }
}

async function main(){
    switch (args[0]) {
        case "GET":
            console.log(args[0]);
            if(args[1] && args[1].startsWith("products")){
                const products = await getProducts(args[1]);
                console.log(products);
            }else{
                console.log("Incorrect command.")
            }
            break;
        case "POST":
            console.log(args[0]);
            if (args[1] && args[2] && args[3] && args[4] && args[1] == "products"){
                await createProduct({title: args[2], price: args[3], category: args[4]})
                console.log("Created product successfully")
            } else {
                console.log("Incorrect command.")
            }
            break;
        case "PUT":
            console.log(args[0]);
            if (args[1] && args[1].startsWith("products/") && args[1].length > 9 && args[2] && args[3]) {
                const updatedProduct = await updateProduct(args[1], {
                    title: args[2],
                    price: args[3],
                    category: args[4]
                });
                console.log("Updated product successfully:", updatedProduct);
            } else {
                console.log("Command PUT incomplete. Usage: PUT products/:id title price.");
            }
            break;
        case "DELETE":
            console.log(args[0]);
            if (args[1].startsWith("products/") && args[1].length > 9){
                const response = await deleteProducts(args[1]);
                console.log("Delete product successfully", response)
            } else {
                console.log("Command delete incomplete.")
            }
            break;
        default:
            console.log("Incorrect command.")
            break;
    }
}

main();


