import Admin from "@/components/admin";
import AdminInvoices from "@/components/Admin_invoice";
import Layout from "@/components/layout";


export default function index(){
    return(
        <Layout>
         <AdminInvoices/>
        </Layout>
    )
}