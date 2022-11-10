import PropTypes from 'prop-types';

const AboutMenu = ({ getComponent }) => {
  const DropdownMenu = getComponent('DropdownMenu');
  const Link = getComponent('Link');

  return (
    <DropdownMenu label="About">
      <div>
        <li className="dropdown-item">
          <Link href="https://swagger.io/tools/swagger-editor/" target="_blank">
            About Swagger Editor
          </Link>
        </li>
      </div>
      <div>
        <li className="dropdown-item">
          <Link
            href="https://swagger.io/docs/open-source-tools/swagger-editor-next/"
            target="_blank"
          >
            View Docs
          </Link>
        </li>
      </div>
      <div>
        <li className="dropdown-item">
          <Link href="https://github.com/swagger-api/swagger-editor/tree/next" target="_blank">
            View on GitHub
          </Link>
        </li>
      </div>
    </DropdownMenu>
  );
};

AboutMenu.propTypes = {
  getComponent: PropTypes.func.isRequired,
};

export default AboutMenu;
