export const testController = (req, res) => {
    res.status(200).send({
        message: "Teste de la route test a réussi avec succès",
        success: true,
    });
};
