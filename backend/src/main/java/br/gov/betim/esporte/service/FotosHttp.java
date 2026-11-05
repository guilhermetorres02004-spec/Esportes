package br.gov.betim.esporte.service;

import java.io.*;
import java.net.URI;
import java.net.HttpURLConnection;
import javax.imageio.ImageIO;
import javax.imageio.stream.MemoryCacheImageInputStream;
import org.springframework.stereotype.Component;

@Component
public class FotosHttp {
    public byte[] baixar(String url, int limite) throws Exception {
        URI uri = URI.create(url);
        if (!"https".equals(uri.getScheme()) || !"www.betim.mg.gov.br".equals(uri.getHost())
                || uri.getPort() != -1 || uri.getUserInfo() != null) throw new IOException("Fonte inválida");
        var conexao = (HttpURLConnection) uri.toURL().openConnection();
        conexao.setConnectTimeout(8000); conexao.setReadTimeout(20000); conexao.setInstanceFollowRedirects(false);
        conexao.setRequestProperty("User-Agent", "PortalEsporteBetim/1.0 (sincronizacao de fotos oficiais)");
        try {
            if (conexao.getResponseCode() != 200) throw new IOException("Fonte indisponível: " + conexao.getResponseCode());
            if (conexao.getContentLengthLong() > limite) throw new IOException("Arquivo excede o limite");
            try (var corpo = conexao.getInputStream()) {
                byte[] dados = corpo.readNBytes(limite + 1);
                if (dados.length > limite) throw new IOException("Arquivo excede o limite");
                return dados;
            }
        } finally { conexao.disconnect(); }
    }

    public static void validarImagem(byte[] dados) throws IOException {
        try (var stream = new MemoryCacheImageInputStream(new ByteArrayInputStream(dados))) {
            var leitores = ImageIO.getImageReaders(stream);
            if (!leitores.hasNext()) throw new IOException("Imagem inválida ou formato não suportado");
            var leitor = leitores.next();
            try {
                leitor.setInput(stream);
                long pixels = (long) leitor.getWidth(0) * leitor.getHeight(0);
                if (pixels < 10000 || pixels > 25_000_000 || leitor.read(0) == null) throw new IOException("Dimensões inválidas");
            } finally { leitor.dispose(); }
        }
    }
}
