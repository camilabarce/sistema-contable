-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 05-09-2023 a las 18:21:32
-- Versión del servidor: 8.0.31
-- Versión de PHP: 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sistcontable`
--

DELIMITER $$
--
-- Procedimientos
--
DROP PROCEDURE IF EXISTS `borrarCuenta`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `borrarCuenta` (IN `codigoCuenta` VARCHAR(9))   BEGIN
	
	UPDATE grupo g, bloque b, rubro r, cuentas c, tipo_cuentas tc
	SET c.mostrarCuenta = 0
	WHERE CONCAT(g.cod_grupo, b.cod_bloque, r.cod_rubro, c.cod_cuenta) = codigoCuenta AND
	tc.id_grupo = g.id_grupo AND
	tc.id_bloque = b.id_bloque AND
	tc.id_rubro = r.id_rubro AND
	tc.id_cuenta = c.id_cuenta;
	
END$$

DROP PROCEDURE IF EXISTS `modificarCuenta`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `modificarCuenta` (IN `nuevoNombre` VARCHAR(50), IN `codigoCuenta` VARCHAR(50), IN `nombreActual` VARCHAR(50))   UPDATE grupo G, bloque B, rubro R, cuentas C, tipo_cuentas TC
SET C.nombre_cuenta = nuevoNombre
WHERE CONCAT(G.cod_grupo, B.cod_bloque, R.cod_rubro, C.cod_cuenta) = codigoCuenta
AND C.nombre_cuenta = nombreActual
AND (TC.id_grupo = G.id_grupo AND TC.id_bloque = B.id_bloque AND TC.id_rubro = R.id_rubro AND TC.id_cuenta = C.id_cuenta)$$

DROP PROCEDURE IF EXISTS `mostrarCuentas`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `mostrarCuentas` (IN `grupoOption` INT(11), IN `bloqueOption` INT(11), IN `rubroOption` INT(11))   select CONCAT(G.cod_grupo, B.cod_bloque, R.cod_rubro, C.cod_cuenta) AS 'codigo',
       CONCAT(UPPER(SUBSTRING(C.nombre_cuenta, 1, 1)), LOWER(SUBSTRING(C.nombre_cuenta, 2))) AS 'nombre',
       CONCAT(UPPER(SUBSTRING(CONCAT(G.nombre_grupo, ' ', B.nombre_bloque), 1, 1)), LOWER(SUBSTRING(CONCAT(G.nombre_grupo, ' ', B.nombre_bloque), 2))) AS 'tipo', C.saldo_cuenta AS 'saldo'
FROM grupo G, bloque B, rubro R, cuentas C, tipo_cuentas TC
where (G.id_grupo = TC.id_grupo and B.id_bloque = TC.id_bloque and R.id_rubro = TC.id_rubro and C.id_cuenta = TC.id_cuenta)
AND (TC.id_grupo = grupoOption and TC.id_bloque = bloqueOption and TC.id_rubro = rubroOption)
AND C.mostrarCuenta = 1$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bloque`
--

DROP TABLE IF EXISTS `bloque`;
CREATE TABLE IF NOT EXISTS `bloque` (
  `id_bloque` int NOT NULL DEFAULT '0',
  `nombre_bloque` varchar(50) NOT NULL,
  `cod_bloque` varchar(2) NOT NULL,
  PRIMARY KEY (`id_bloque`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `bloque`
--

INSERT INTO `bloque` (`id_bloque`, `nombre_bloque`, `cod_bloque`) VALUES
(1, 'corriente', '1'),
(2, 'no corriente', '2'),
(3, 'ordinario ', '3'),
(4, 'extraordinario', '4'),
(5, '', '5');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cuentas`
--

DROP TABLE IF EXISTS `cuentas`;
CREATE TABLE IF NOT EXISTS `cuentas` (
  `id_cuenta` int NOT NULL,
  `nombre_cuenta` varchar(50) NOT NULL,
  `cod_cuenta` varchar(3) NOT NULL,
  `saldo_cuenta` decimal(10,2) NOT NULL,
  `mostrarCuenta` tinyint(1) NOT NULL,
  PRIMARY KEY (`id_cuenta`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `cuentas`
--

INSERT INTO `cuentas` (`id_cuenta`, `nombre_cuenta`, `cod_cuenta`, `saldo_cuenta`, `mostrarCuenta`) VALUES
(1, 'caja', '001', '0.00', 1),
(2, 'banco Galicia c/c', '002', '0.00', 1),
(3, 'valores a depositar', '003', '0.00', 1),
(4, 'moneda extranjera', '004', '0.00', 1),
(5, 'banco Galicia caja de ahorro', '005', '0.00', 1),
(6, 'fondo fijo', '006', '0.00', 1),
(7, 'banco Galicia plazo fijo ', '001', '0.00', 1),
(8, 'titulos publicos', '002', '0.00', 1),
(9, 'acciones con cotizacion', '003', '0.00', 1),
(10, 'prestamos a cobrar a corto plazo', '004', '0.00', 1),
(11, 'moneda extranjera', '005', '0.00', 1),
(12, 'prevision por desvalorizacion de titulos y accione', '006', '0.00', 1),
(13, 'prevision por desvalorizacion de moneda extranjera', '007', '0.00', 1),
(14, 'deudores por ventas', '001', '0.00', 1),
(15, 'deudores morosos', '002', '0.00', 1),
(16, 'deudores en gestion judicial', '003', '0.00', 1),
(17, 'documentos a cobrar', '004', '0.00', 1),
(18, 'intereses no devengados de documentos a cobrar', '005', '0.00', 1),
(19, 'componente financiero implicito de deudores por ve', '006', '0.00', 1),
(20, 'documentos a cobrar endosados', '007', '0.00', 1),
(21, 'documentos a cobrar descontados', '008', '0.00', 1),
(22, 'prevision para deudores incobrables', '009', '0.00', 1),
(23, 'deudores varios', '001', '0.00', 1),
(24, 'anticipo de sueldos', '002', '0.00', 1),
(25, 'anticipo de gastos', '003', '0.00', 1),
(26, 'seguros pagados por adelantado', '004', '0.00', 1),
(27, 'intereses a cobrar', '005', '0.00', 1),
(28, 'iva credito fiscal', '006', '0.00', 1),
(29, 'accionistas', '007', '0.00', 1),
(30, 'socio xx cuenta aporte', '008', '0.00', 1),
(31, 'deposito en garantia', '009', '0.00', 1),
(32, 'valores diferidos a depositar', '010', '0.00', 1),
(33, 'hipotecas a cobrar', '011', '0.00', 1),
(34, 'mercaderias', '001', '0.00', 1),
(35, 'mercaderias entregadas en consignacion', '002', '0.00', 1),
(36, 'mercaderias en transito', '003', '0.00', 1),
(37, 'anticipo a proveedores', '004', '0.00', 1),
(38, 'materias primas', '005', '0.00', 1),
(39, 'productos en proceso', '006', '0.00', 1),
(40, 'productos terminados', '007', '0.00', 1),
(41, 'prevision por desvalorizacion de mercaderias', '008', '0.00', 1),
(42, 'bienes de uso desafectados', '001', '0.00', 1),
(43, 'idem activo corriente', '001', '0.00', 1),
(44, 'idem activo corriente', '001', '0.00', 1),
(45, 'idem activo corriente', '001', '0.00', 1),
(46, 'acciones de sociedades controladas', '001', '0.00', 1),
(47, 'inmueble para renta', '001', '0.00', 1),
(48, 'amortizacion acumulada de inmueble para renta', '002', '0.00', 1),
(49, 'titulos publicos', '003', '0.00', 1),
(50, 'debentures', '004', '0.00', 1),
(51, 'prestamos a cobrar a largo plazo', '005', '0.00', 1),
(52, 'inmuebles', '001', '0.00', 1),
(53, 'muebles y utiles', '002', '0.00', 1),
(54, 'rodados', '003', '0.00', 1),
(55, 'instalaciones', '004', '0.00', 1),
(56, 'equipos de computacion', '005', '0.00', 1),
(57, 'herramientas', '006', '0.00', 1),
(58, 'maquinarias', '007', '0.00', 1),
(59, 'terrenos', '008', '0.00', 1),
(60, 'amortizacion acumulada de cada bien en particular', '009', '0.00', 1),
(61, 'anticipo a acreedores', '010', '0.00', 1),
(62, 'marca de fabrica', '001', '0.00', 1),
(63, 'patente de invencion', '002', '0.00', 1),
(64, 'concesiones', '003', '0.00', 1),
(65, 'derecho de autor', '004', '0.00', 1),
(66, 'derecho de edicion', '005', '0.00', 1),
(67, 'licencia de fabricacion', '006', '0.00', 1),
(68, 'franquicias', '007', '0.00', 1),
(69, 'gastos de organizacion', '008', '0.00', 1),
(70, 'gastos de investigacion y desarrollo', '009', '0.00', 1),
(71, 'formulas', '010', '0.00', 1),
(72, 'amortizacion acumulada de cada bien en particular', '011', '0.00', 1),
(73, 'otros activos', '001', '0.00', 1),
(74, 'llave de negocio', '001', '0.00', 1),
(75, 'proveedores', '001', '0.00', 1),
(76, 'documentos a pagar', '002', '0.00', 1),
(77, 'intereses no devengados de documentos a pagar', '003', '0.00', 1),
(78, 'componente financiero implícito de proveedores', '004', '0.00', 1),
(79, 'acreedores varios', '005', '0.00', 1),
(80, 'gastos a pagar', '006', '0.00', 1),
(81, 'adelanto en c/c', '001', '0.00', 1),
(82, 'prestamos a pagar', '002', '0.00', 1),
(83, 'prenda a pagar', '003', '0.00', 1),
(84, 'acreedores prendarios', '004', '0.00', 1),
(85, 'hipoteca a pagar', '005', '0.00', 1),
(86, 'acreedores hipotecarios', '006', '0.00', 1),
(87, 'honorarios a pagar', '001', '0.00', 1),
(88, 'sueldos a pagar', '002', '0.00', 1),
(89, 'cargas sociales a pagar', '003', '0.00', 1),
(90, 'art a pagar', '004', '0.00', 1),
(91, 'sindicato a pagar', '005', '0.00', 1),
(92, 'impuestos a pagar', '001', '0.00', 1),
(93, 'iva debito fiscal', '002', '0.00', 1),
(94, 'iva a pagar', '003', '0.00', 1),
(95, 'retencion de impuesto a las ganancias', '004', '0.00', 1),
(96, 'retencion de iva', '005', '0.00', 1),
(97, 'anticipo de clientes', '001', '0.00', 1),
(98, 'dividendos a pagar', '001', '0.00', 1),
(99, 'socio “XX” cuenta particular', '001', '0.00', 1),
(100, 'alquileres cobrados por adelantado', '002', '0.00', 1),
(101, 'prevision para despidos', '001', '0.00', 1),
(102, 'prevision para juicios pendientes', '002', '0.00', 1),
(103, 'prevision para service y garantia', '003', '0.00', 1),
(104, 'idem pasivo corriente', '001', '0.00', 1),
(105, 'idem pasivo corriente', '001', '0.00', 1),
(106, 'capital suscripto', '001', '0.00', 1),
(107, 'acciones en circulacion', '001', '0.00', 1),
(108, 'ajuste de capital', '002', '0.00', 1),
(109, 'primas de emision', '003', '0.00', 1),
(110, 'aportes irrevocables', '004', '0.00', 1),
(111, 'dividendos en acciones', '005', '0.00', 1),
(112, 'reserva legal', '001', '0.00', 1),
(113, 'reserva facultativa', '002', '0.00', 1),
(114, 'reserva estatutaria', '003', '0.00', 1),
(115, 'reserva para renovacion de equipos', '004', '0.00', 1),
(116, 'resultados no asignados', '005', '0.00', 1),
(117, 'resultado del ejercicio', '006', '0.00', 1),
(118, 'ventas', '001', '0.00', 1),
(119, 'costo de ventas', '001', '0.00', 1),
(120, 'costo de las mercaderias vendidas', '002', '0.00', 1),
(121, 'amortizacion de rodados', '001', '0.00', 1),
(122, 'gastos de publicidad', '002', '0.00', 1),
(123, 'sueldos de vendedores', '003', '0.00', 1),
(124, 'cargas sociales de vendedores', '004', '0.00', 1),
(125, 'alquileres cedidos', '005', '0.00', 1),
(126, 'fletes', '006', '0.00', 1),
(127, 'deudores incobrables', '007', '0.00', 1),
(128, 'seguros', '008', '0.00', 1),
(129, 'amortizacion de inmuebles', '009', '0.00', 1),
(130, 'sueldos de administracion', '001', '0.00', 1),
(131, 'cargas sociales de administracion', '002', '0.00', 1),
(132, 'alquileres cedidos', '003', '0.00', 1),
(133, 'seguros', '004', '0.00', 1),
(134, 'gastos de libreria', '005', '0.00', 1),
(135, 'gastos bancarios', '006', '0.00', 1),
(136, 'amortizacion de muebles y utiles', '007', '0.00', 1),
(137, 'amortizacion de inmuebles ', '008', '0.00', 1),
(138, 'ingresos generados por inversiones en sociedades', '001', '0.00', 1),
(139, 'gastos generados por inversiones en sociedades', '002', '0.00', 1),
(140, 'depreciacion de la llave de negocio en los entes r', '001', '0.00', 1),
(141, 'intereses ganados', '001', '0.00', 1),
(142, 'intereses cedidos', '002', '0.00', 1),
(143, 'diferencia de cambio positiva', '003', '0.00', 1),
(144, 'diferencia de cambio negativa', '004', '0.00', 1),
(145, 'alquileres ganados', '001', '0.00', 1),
(146, 'sobrante de prevision', '002', '0.00', 1),
(147, 'sobrante de caja', '003', '0.00', 1),
(148, 'faltante de caja', '004', '0.00', 1),
(149, 'amortizacion de activos intangibles', '005', '0.00', 1),
(150, 'amortizacion de inmueble para renta', '006', '0.00', 1),
(151, 'sobrante de mercaderias', '007', '0.00', 1),
(152, 'faltante de mercaderias', '008', '0.00', 1),
(153, 'comisiones cobradas', '009', '0.00', 1),
(154, 'comisiones pagadas', '010', '0.00', 1),
(155, 'impuesto a operaciones ordinarias', '001', '0.00', 1),
(156, 'impuesto neto a las ganancias', '001', '0.00', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grupo`
--

DROP TABLE IF EXISTS `grupo`;
CREATE TABLE IF NOT EXISTS `grupo` (
  `id_grupo` int NOT NULL,
  `nombre_grupo` varchar(50) NOT NULL,
  `cod_grupo` varchar(2) NOT NULL,
  PRIMARY KEY (`id_grupo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `grupo`
--

INSERT INTO `grupo` (`id_grupo`, `nombre_grupo`, `cod_grupo`) VALUES
(1, 'activo', '1'),
(2, 'pasivo', '2'),
(3, 'patrimonio neto', '3'),
(4, 'resultado', '4');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rubro`
--

DROP TABLE IF EXISTS `rubro`;
CREATE TABLE IF NOT EXISTS `rubro` (
  `id_rubro` int NOT NULL,
  `nombre_rubro` varchar(50) NOT NULL,
  `cod_rubro` varchar(2) NOT NULL,
  PRIMARY KEY (`id_rubro`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `rubro`
--

INSERT INTO `rubro` (`id_rubro`, `nombre_rubro`, `cod_rubro`) VALUES
(1, 'caja y bancos', '01'),
(2, 'inversiones temporarias', '02'),
(3, 'creditos por ventas', '03'),
(4, 'otros creditos', '04'),
(5, 'bienes de cambio', '05'),
(6, 'otros activos', '06'),
(7, 'creditos por ventas', '01'),
(8, 'otros creditos', '02'),
(9, 'bienes de cambio', '03'),
(10, 'participacion permanente en sociedades', '04'),
(11, 'otras inversiones', '05'),
(12, 'bienes de uso', '06'),
(13, 'activos intangibles', '07'),
(14, 'otros activos', '08'),
(15, 'llave de negocio', '09'),
(16, 'deudas comerciales', '01'),
(17, 'prestamos', '02'),
(18, 'remuneraciones y cargas sociales', '03'),
(19, 'cargas fiscales', '04'),
(20, 'anticipo de clientes', '05'),
(21, 'dividendos a pagar', '06'),
(22, 'otras deudas', '07'),
(23, 'previsiones', '08'),
(24, 'deudas', '01'),
(25, 'previsiones', '02'),
(26, 'aporte de los propietarios', '01'),
(27, 'resultados acumulados', '02'),
(28, 'ventas netas de bienes y servicios', '01'),
(29, 'costos de los bienes vendidos y servicios prestado', '02'),
(30, 'gastos de comercializacion', '03'),
(31, 'gastos de administracion', '04'),
(32, 'resultados de inversiones en entes relacionados', '05'),
(33, 'depreciacion de la llave de negocio en los estados', '06'),
(34, 'resultados financieros y por tenencia', '07'),
(35, 'otros ingresos y egresos', '08'),
(36, 'impuesto a las ganancias', '09'),
(37, 'participacion minoritaria sobre los resultados', '10');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_cuentas`
--

DROP TABLE IF EXISTS `tipo_cuentas`;
CREATE TABLE IF NOT EXISTS `tipo_cuentas` (
  `id_grupo` int NOT NULL,
  `id_bloque` int NOT NULL,
  `id_rubro` int NOT NULL,
  `id_cuenta` int NOT NULL,
  PRIMARY KEY (`id_grupo`,`id_bloque`,`id_rubro`,`id_cuenta`),
  KEY `bloque_idx` (`id_bloque`),
  KEY `rubro_idx` (`id_rubro`),
  KEY `cuentas_idx` (`id_cuenta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `tipo_cuentas`
--

INSERT INTO `tipo_cuentas` (`id_grupo`, `id_bloque`, `id_rubro`, `id_cuenta`) VALUES
(1, 1, 1, 1),
(1, 1, 1, 2),
(1, 1, 1, 3),
(1, 1, 1, 4),
(1, 1, 1, 5),
(1, 1, 1, 6),
(1, 1, 2, 7),
(1, 1, 2, 8),
(1, 1, 2, 9),
(1, 1, 2, 10),
(1, 1, 2, 11),
(1, 1, 2, 12),
(1, 1, 2, 13),
(1, 1, 3, 14),
(1, 1, 3, 15),
(1, 1, 3, 16),
(1, 1, 3, 17),
(1, 1, 3, 18),
(1, 1, 3, 19),
(1, 1, 3, 20),
(1, 1, 3, 21),
(1, 1, 3, 22),
(1, 1, 4, 23),
(1, 1, 4, 24),
(1, 1, 4, 25),
(1, 1, 4, 26),
(1, 1, 4, 27),
(1, 1, 4, 28),
(1, 1, 4, 29),
(1, 1, 4, 30),
(1, 1, 4, 31),
(1, 1, 4, 32),
(1, 1, 4, 33),
(1, 1, 5, 34),
(1, 1, 5, 35),
(1, 1, 5, 36),
(1, 1, 5, 37),
(1, 1, 5, 38),
(1, 1, 5, 39),
(1, 1, 5, 40),
(1, 1, 5, 41),
(1, 1, 6, 42),
(2, 1, 16, 75),
(2, 1, 16, 76),
(2, 1, 16, 77),
(2, 1, 16, 78),
(2, 1, 16, 79),
(2, 1, 16, 80),
(2, 1, 17, 81),
(2, 1, 17, 82),
(2, 1, 17, 83),
(2, 1, 17, 84),
(2, 1, 17, 85),
(2, 1, 17, 86),
(2, 1, 18, 87),
(2, 1, 18, 88),
(2, 1, 18, 89),
(2, 1, 18, 90),
(2, 1, 18, 91),
(2, 1, 19, 92),
(2, 1, 19, 93),
(2, 1, 19, 94),
(2, 1, 19, 95),
(2, 1, 19, 96),
(2, 1, 20, 97),
(2, 1, 21, 98),
(2, 1, 22, 99),
(2, 1, 22, 100),
(2, 1, 23, 101),
(2, 1, 23, 102),
(2, 1, 23, 103),
(1, 2, 7, 43),
(1, 2, 8, 44),
(1, 2, 9, 45),
(1, 2, 10, 46),
(1, 2, 11, 47),
(1, 2, 11, 48),
(1, 2, 11, 49),
(1, 2, 11, 50),
(1, 2, 11, 51),
(1, 2, 12, 52),
(1, 2, 12, 53),
(1, 2, 12, 54),
(1, 2, 12, 55),
(1, 2, 12, 56),
(1, 2, 12, 57),
(1, 2, 12, 58),
(1, 2, 12, 59),
(1, 2, 12, 60),
(1, 2, 12, 61),
(1, 2, 13, 62),
(1, 2, 13, 63),
(1, 2, 13, 64),
(1, 2, 13, 65),
(1, 2, 13, 66),
(1, 2, 13, 67),
(1, 2, 13, 68),
(1, 2, 13, 69),
(1, 2, 13, 70),
(1, 2, 13, 71),
(1, 2, 13, 72),
(1, 2, 14, 73),
(1, 2, 15, 74),
(2, 2, 24, 104),
(2, 2, 25, 105),
(4, 3, 28, 118),
(4, 3, 29, 119),
(4, 3, 29, 120),
(4, 3, 30, 121),
(4, 3, 30, 122),
(4, 3, 30, 123),
(4, 3, 30, 124),
(4, 3, 30, 125),
(4, 3, 30, 126),
(4, 3, 30, 127),
(4, 3, 30, 128),
(4, 3, 30, 129),
(4, 3, 31, 130),
(4, 3, 31, 131),
(4, 3, 31, 132),
(4, 3, 31, 133),
(4, 3, 31, 134),
(4, 3, 31, 135),
(4, 3, 31, 136),
(4, 3, 31, 137),
(4, 3, 32, 138),
(4, 3, 32, 139),
(4, 3, 33, 140),
(4, 3, 34, 141),
(4, 3, 34, 142),
(4, 3, 34, 143),
(4, 3, 34, 144),
(4, 3, 35, 145),
(4, 3, 35, 146),
(4, 3, 35, 147),
(4, 3, 35, 148),
(4, 3, 35, 149),
(4, 3, 35, 150),
(4, 3, 35, 151),
(4, 3, 35, 152),
(4, 3, 35, 153),
(4, 3, 35, 154),
(4, 3, 36, 155),
(4, 3, 37, 156),
(3, 5, 26, 106),
(3, 5, 26, 107),
(3, 5, 26, 108),
(3, 5, 26, 109),
(3, 5, 26, 110),
(3, 5, 26, 111),
(3, 5, 27, 112),
(3, 5, 27, 113),
(3, 5, 27, 114),
(3, 5, 27, 115),
(3, 5, 27, 116),
(3, 5, 27, 117);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `tipo_cuentas`
--
ALTER TABLE `tipo_cuentas`
  ADD CONSTRAINT `bloque` FOREIGN KEY (`id_bloque`) REFERENCES `bloque` (`id_bloque`),
  ADD CONSTRAINT `cuentas` FOREIGN KEY (`id_cuenta`) REFERENCES `cuentas` (`id_cuenta`),
  ADD CONSTRAINT `grupo` FOREIGN KEY (`id_grupo`) REFERENCES `grupo` (`id_grupo`),
  ADD CONSTRAINT `rubro` FOREIGN KEY (`id_rubro`) REFERENCES `rubro` (`id_rubro`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;