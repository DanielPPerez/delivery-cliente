export async function getServerSideProps({ req, res }) {
  if (req.url === '/old-page') {
    res.writeHead(301, { Location: '/new-page' });
    res.end();
  }

  return { props: {} };
}