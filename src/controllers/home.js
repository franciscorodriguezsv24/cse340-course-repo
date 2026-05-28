const showHome = (req, res) => {
    const title = 'Home';
    res.render('home', { title });
};

export { showHome };
